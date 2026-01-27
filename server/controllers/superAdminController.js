const Seller = require('../models/Seller');
const User = require('../models/User');

// Get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const sellers = await Seller.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: sellers.length,
      sellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Approve seller
exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.status = 'approved';
    await seller.save();

    res.json({
      success: true,
      message: 'Seller approved successfully',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject seller
exports.rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.status = 'rejected';
    await seller.save();

    res.json({
      success: true,
      message: 'Seller rejected',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Suspend seller
exports.suspendSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.status = 'suspended';
    await seller.save();

    res.json({
      success: true,
      message: 'Seller suspended',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update seller commission
exports.updateCommission = async (req, res) => {
  try {
    const { commission } = req.body;

    if (commission < 0 || commission > 100) {
      return res.status(400).json({
        success: false,
        message: 'Commission must be between 0 and 100'
      });
    }

    const seller = await Seller.findById(req.params.id);
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    seller.commission = commission;
    await seller.save();

    res.json({
      success: true,
      message: 'Commission updated successfully',
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get platform statistics
exports.getPlatformStats = async (req, res) => {
  try {
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({ status: 'pending' });
    const approvedSellers = await Seller.countDocuments({ status: 'approved' });
    const suspendedSellers = await Seller.countDocuments({ status: 'suspended' });

    const Order = require('../models/Order');
    const Product = require('../models/Product');

    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total platform revenue and commission
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const totalCommission = orders.reduce((sum, order) => sum + (order.platformCommission || 0), 0);

    res.json({
      success: true,
      stats: {
        sellers: {
          total: totalSellers,
          pending: pendingSellers,
          approved: approvedSellers,
          suspended: suspendedSellers
        },
        totalOrders,
        totalProducts,
        revenue: {
          total: totalRevenue,
          commission: totalCommission
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
