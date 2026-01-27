const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  businessName: {
    type: String,
    required: true
  },
  businessEmail: {
    type: String,
    required: true
  },
  businessPhone: {
    type: String
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  commission: {
    type: Number,
    default: 10,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'suspended'],
    default: 'pending'
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    routingNumber: String
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  totalOrders: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Seller', sellerSchema);
