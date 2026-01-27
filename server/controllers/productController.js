const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, category, search, minPrice, maxPrice, sort = '-createdAt' } = req.query;

    // Build query
    const query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'businessName')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'businessName');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, featured } = req.body;

    // Get seller ID from user
    const Seller = require('../models/Seller');
    const seller = await Seller.findOne({ user: req.user._id });
    
    if (!seller && req.user.role === 'seller') {
      return res.status(400).json({
        success: false,
        message: 'Seller profile not found. Please complete seller registration.'
      });
    }

    // Check if image file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a product image'
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecommerce/products',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }
      ]
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      imageUrl: result.secure_url,
      featured: featured || false,
      seller: seller ? seller._id : null // Assign seller if exists
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('seller', 'businessName');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, stock, category, featured } = req.body;
    const updateData = { name, description, price, stock, category, featured };

    // If new image is uploaded
    if (req.file) {
      // Upload new image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'ecommerce/products',
        transformation: [
          { width: 800, height: 800, crop: 'limit' }
        ]
      });

      updateData.imageUrl = result.secure_url;

      // Delete local file
      fs.unlinkSync(req.file.path);
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ featured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
};
