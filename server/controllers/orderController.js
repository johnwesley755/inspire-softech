const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Prepare order items and get seller from first product
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.imageUrl
    }));

    // Get seller from first product (assuming all items from same seller for now)
    const firstProduct = await Product.findById(cart.items[0].product._id).populate('seller');
    const seller = firstProduct.seller;
    
    // Calculate commission
    const commissionRate = seller ? seller.commission : 0;
    const platformCommission = (cart.totalPrice * commissionRate) / 100;
    const sellerRevenue = cart.totalPrice - platformCommission;

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: cart.totalPrice,
      seller: seller ? seller._id : null,
      platformCommission,
      sellerRevenue,
      status: 'Pending'
    });

    // Update product stock and seller stats
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Update seller revenue and order count
    if (seller) {
      const Seller = require('../models/Seller');
      await Seller.findByIdAndUpdate(seller._id, {
        $inc: { 
          totalRevenue: sellerRevenue,
          totalOrders: 1 
        }
      });
    }

    // Clear cart atomically
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [], totalPrice: 0 } }
    );

    const populatedOrder = await Order.findById(order._id).populate('items.product');

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check permissions
    let isAuthorized = false;

    // 1. User owns the order
    if (order.user.toString() === req.user.id) {
      isAuthorized = true;
    }
    // 2. User is admin
    else if (req.user.role === 'admin') {
      isAuthorized = true;
    }
    // 3. User is the seller for this order
    else if (req.user.role === 'seller') {
      const Seller = require('../models/Seller');
      const seller = await Seller.findOne({ user: req.user._id });
      if (seller && order.seller && order.seller.toString() === seller._id.toString()) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    let query = status ? { status } : {};

    // Filter for sellers
    if (req.user.role === 'seller') {
      const Seller = require('../models/Seller');
      const seller = await Seller.findOne({ user: req.user._id });
      if (seller) {
        query.seller = seller._id;
      } else {
        return res.status(200).json({
          success: true,
          count: 0,
          total: 0,
          totalPages: 0,
          currentPage: Number(page),
          orders: []
        });
      }
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('items.product')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check seller permission
    if (req.user.role === 'seller') {
      const Seller = require('../models/Seller');
      const seller = await Seller.findOne({ user: req.user._id });
      if (!seller || !order.seller || order.seller.toString() !== seller._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to update this order'
        });
      }
    }

    order.status = status;
    await order.save();

    order = await Order.findById(order._id).populate('user', 'name email').populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation if order is pending
    if (order.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already being processed'
      });
    }

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
};
