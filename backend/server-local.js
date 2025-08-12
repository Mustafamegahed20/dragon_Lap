// Simple local server for development
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import API handlers
const categoriesHandler = require('./api/categories');
const productsHandler = require('./api/products');
const productByIdHandler = require('./api/products/[id]');
const registerHandler = require('./api/auth/register');
const loginHandler = require('./api/auth/login');
const ordersHandler = require('./api/orders');
const adminOrdersHandler = require('./api/admin/orders');

// Convert Vercel handlers to Express routes
const wrapHandler = (handler) => {
  return async (req, res) => {
    // Mock Vercel's req.query for dynamic routes
    if (req.params.id) {
      req.query = { ...req.query, id: req.params.id };
    }
    
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Route error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
};

// Define routes
app.get('/api', (req, res) => {
  res.json({ message: 'Dragon Lap API is running locally!' });
});

app.get('/api/categories', wrapHandler(categoriesHandler));
app.get('/api/products', wrapHandler(productsHandler));
app.get('/api/products/:id', wrapHandler(productByIdHandler));
app.post('/api/auth/register', wrapHandler(registerHandler));
app.post('/api/auth/login', wrapHandler(loginHandler));
app.post('/api/orders', wrapHandler(ordersHandler));
app.get('/api/admin/orders', wrapHandler(adminOrdersHandler));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/categories');
  console.log('  GET  /api/products');
  console.log('  GET  /api/products/:id');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  POST /api/orders');
  console.log('  GET  /api/admin/orders');
});

module.exports = app;