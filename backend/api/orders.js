const connectDB = require('../lib/mongodb');
const Order = require('../models/Order');
const { optionalAuthMiddleware } = require('../lib/auth');

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Apply optional auth middleware
  optionalAuthMiddleware(req, res, async () => {
    try {
      await connectDB();

      const { items, total, address, customerInfo } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'No items' });
      }
      
      // For guest checkout, require customer info
      if (!req.user && (!customerInfo || !customerInfo.name || !customerInfo.email)) {
        return res.status(400).json({ error: 'Customer information required for guest checkout' });
      }
      
      const userId = req.user ? req.user.id : null;
      const customerName = req.user ? req.user.name : customerInfo.name;
      const customerEmail = req.user ? req.user.email : customerInfo.email;
      const customerPhone = customerInfo.phone || '';
      
      // Handle structured address or string address
      const addressString = typeof address === 'object' 
        ? `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`
        : address;
      
      // Create order with embedded items
      const order = new Order({
        user_id: userId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        total,
        address: addressString,
        status: 'pending',
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.qty,
          price: item.price
        }))
      });
      
      await order.save();
      res.json({ orderId: order._id });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ error: error.message });
    }
  });
}