const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// @desc    Process payment (Mock)
// @route   POST /api/payment/process
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, cardDetails } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Validate payment method
    const validMethods = ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'];
    if (!validMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method'
      });
    }

    // Mock payment processing
    let paymentStatus = 'success';
    let transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();

    // Simulate card validation for credit/debit cards
    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      if (!cardDetails || !cardDetails.cardNumber || !cardDetails.cvv || !cardDetails.expiryDate) {
        return res.status(400).json({
          success: false,
          message: 'Card details are required'
        });
      }

      // Mock card validation (simple check)
      if (cardDetails.cardNumber.length < 13 || cardDetails.cvv.length < 3) {
        return res.status(400).json({
          success: false,
          message: 'Invalid card details'
        });
      }

      // Simulate 5% payment failure rate for testing
      if (Math.random() < 0.05) {
        paymentStatus = 'failed';
        return res.status(400).json({
          success: false,
          message: 'Payment declined. Please try again or use a different card.'
        });
      }
    }

    // Mock successful payment response
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        transactionId,
        amount,
        paymentMethod,
        status: paymentStatus,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// @desc    Verify payment
// @route   GET /api/payment/verify/:transactionId
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Mock verification - in real app, this would check with payment gateway
    if (!transactionId || !transactionId.startsWith('TXN')) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.status(200).json({
      success: true,
      payment: {
        transactionId,
        status: 'verified',
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Verification failed',
      error: error.message
    });
  }
};

router.post('/process', protect, processPayment);
router.get('/verify/:transactionId', protect, verifyPayment);

module.exports = router;
