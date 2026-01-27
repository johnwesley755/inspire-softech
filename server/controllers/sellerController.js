const Seller = require('../models/Seller');

// Register as seller
exports.registerSeller = async (req, res) => {
  const { generateToken } = require('../utils/tokenUtils');
  try {
    const { businessName, businessEmail, businessPhone, businessAddress, bankDetails } = req.body;

    // Check if user is already a seller
    const existingSeller = await Seller.findOne({ user: req.user._id });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered as a seller'
      });
    }

    // Create seller
    const seller = await Seller.create({
      user: req.user._id,
      businessName,
      businessEmail,
      businessPhone,
      businessAddress,
      bankDetails,
      status: 'pending'
    });

    // Update user role to seller
    req.user.role = 'seller';
    await req.user.save();

    // Generate new token with updated role
    const token = generateToken(req.user._id, req.user.role);

    res.status(201).json({
      success: true,
      message: 'Seller registration submitted. Awaiting approval.',
      seller,
      token,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get my seller profile
exports.getMyProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate('user', 'name email');
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update my seller profile
exports.updateMyProfile = async (req, res) => {
  try {
    const { businessName, businessEmail, businessPhone, businessAddress, bankDetails } = req.body;

    const seller = await Seller.findOne({ user: req.user._id });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    // Update fields
    if (businessName) seller.businessName = businessName;
    if (businessEmail) seller.businessEmail = businessEmail;
    if (businessPhone) seller.businessPhone = businessPhone;
    if (businessAddress) seller.businessAddress = businessAddress;
    if (bankDetails) seller.bankDetails = bankDetails;

    await seller.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get my dashboard stats
exports.getMyStats = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    const Product = require('../models/Product');
    const Order = require('../models/Order');

    const totalProducts = await Product.countDocuments({ seller: seller._id });
    const pendingOrders = await Order.countDocuments({ 
      seller: seller._id, 
      status: 'Pending' 
    });

    res.json({
      success: true,
      stats: {
        totalRevenue: seller.totalRevenue,
        totalOrders: seller.totalOrders,
        totalProducts,
        pendingOrders,
        commission: seller.commission,
        status: seller.status
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get my revenue analytics
exports.getMyRevenue = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller profile not found'
      });
    }

    const Order = require('../models/Order');

    const orders = await Order.find({ seller: seller._id, status: { $ne: 'Cancelled' } })
      .sort({ createdAt: -1 })
      .limit(50);

    const totalRevenue = seller.totalRevenue;
    const totalCommission = orders.reduce((sum, order) => sum + (order.platformCommission || 0), 0);
    const netRevenue = totalRevenue - totalCommission;

    res.json({
      success: true,
      revenue: {
        totalRevenue,
        totalCommission,
        netRevenue,
        commissionRate: seller.commission,
        recentOrders: orders
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get seller public profile
exports.getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id)
      .populate('user', 'name')
      .select('-bankDetails'); // Don't expose bank details

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
