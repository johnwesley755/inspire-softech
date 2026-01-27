const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { sellerOrSuperAdmin } = require('../middleware/roleMiddleware');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Protected routes (Seller or Super Admin)
router.post('/', protect, sellerOrSuperAdmin, upload.single('image'), createProduct);
router.put('/:id', protect, sellerOrSuperAdmin, upload.single('image'), updateProduct);
router.delete('/:id', protect, sellerOrSuperAdmin, deleteProduct);

module.exports = router;
