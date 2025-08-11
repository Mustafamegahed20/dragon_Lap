const connectDB = require('../../lib/mongodb');
const Order = require('../../models/Order');
const { authMiddleware, adminMiddleware } = require('../../lib/auth');

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply auth middleware
  authMiddleware(req, res, () => {
    adminMiddleware(req, res, async () => {
      try {
        await connectDB();

        const orders = await Order.find({})
          .populate('user_id', 'name email')
          .populate('items.product_id', 'name price image')
          .sort({ createdAt: -1 });
        
        res.json(orders);
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
      }
    });
  });
}