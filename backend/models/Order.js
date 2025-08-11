const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  customer_name: {
    type: String,
    required: true,
    trim: true
  },
  customer_email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customer_phone: {
    type: String,
    trim: true
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);