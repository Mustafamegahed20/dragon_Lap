const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    trim: true
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },
  cpu: {
    type: String,
    trim: true
  },
  ram: {
    type: String,
    trim: true
  },
  storage: {
    type: String,
    trim: true
  },
  graphics: {
    type: String,
    trim: true
  },
  screen_size: {
    type: String,
    trim: true
  },
  operating_system: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  battery: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);