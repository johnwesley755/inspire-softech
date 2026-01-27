const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { sellerOrSuperAdmin } = require('../middleware/roleMiddleware');

// User routes
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);
router.delete('/:id', protect, cancelOrder);

// Protected routes (Seller or Super Admin)
router.get('/admin/all', protect, sellerOrSuperAdmin, getAllOrders);
router.put('/:id/status', protect, sellerOrSuperAdmin, updateOrderStatus);

module.exports = router;
