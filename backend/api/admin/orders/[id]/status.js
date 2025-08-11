const connectDB = require('../../../../lib/mongodb');
const Order = require('../../../../models/Order');
const { authMiddleware, adminMiddleware } = require('../../../../lib/auth');

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

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  // Apply auth middleware
  authMiddleware(req, res, () => {
    adminMiddleware(req, res, async () => {
      try {
        await connectDB();

        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ error: 'Invalid status' });
        }
        
        const order = await Order.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );
        
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json({ message: 'Order status updated successfully' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  });
}