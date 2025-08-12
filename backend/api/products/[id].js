const connectDB = require('../../lib/mongodb');
const Product = require('../../models/Product');
const mongoose = require('mongoose');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;

  // Validate ObjectId format
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid product ID format' });
  }

  try {
    await connectDB();

    if (req.method === 'GET') {
      const product = await Product.findById(id).populate('category_id', 'name');
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Product by ID API error:', err);
    res.status(500).json({ error: err.message });
  }
}