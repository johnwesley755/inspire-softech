const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sellerOnly } = require('../middleware/roleMiddleware');
const {
  registerSeller,
  getMyProfile,
  updateMyProfile,
  getMyStats,
  getMyRevenue,
  getSellerProfile
} = require('../controllers/sellerController');

// Public routes
router.get('/:id', getSellerProfile);

// Protected seller routes
router.post('/register', protect, registerSeller);
router.get('/me/profile', protect, sellerOnly, getMyProfile);
router.put('/me/profile', protect, sellerOnly, updateMyProfile);
router.get('/me/stats', protect, sellerOnly, getMyStats);
router.get('/me/revenue', protect, sellerOnly, getMyRevenue);

module.exports = router;
