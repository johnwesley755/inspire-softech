const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { register, login, getMe, logout, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, upload.single('image'), updateProfile);
router.post('/logout', protect, logout);

module.exports = router;
