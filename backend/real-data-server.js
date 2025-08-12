const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware with detailed CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Load real laptop data
const categories = JSON.parse(fs.readFileSync('processed-categories.json', 'utf8'));
const products = JSON.parse(fs.readFileSync('processed-products.json', 'utf8'));

// Clean up categories (remove invalid ones)
const validCategories = categories.filter(cat => 
  cat.name !== 'BRAND' && cat.name.length > 1
).map(cat => ({
  ...cat,
  name: cat.name === 'DELLL' ? 'DELL' : cat.name
}));

// Add Acer if not present (you mentioned it should be there)
const brandNames = validCategories.map(c => c.name);
if (!brandNames.includes('ACER')) {
  validCategories.push({
    _id: (validCategories.length + 1).toString(),
    name: 'ACER'
  });
}

// Filter and fix products
const validProducts = products.filter(product => 
  product.category_id.name !== 'BRAND' && product.name !== 'BRAND '
).map(product => ({
  ...product,
  category_id: {
    ...product.category_id,
    name: product.category_id.name === 'DELLL' ? 'DELL' : product.category_id.name
  },
  // Use placeholder image for now
  image: '/images/laptops/placeholder-laptop.jpg'
}));

console.log(`Loaded ${validCategories.length} categories and ${validProducts.length} products`);

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Dragon Lap API with Real Data!',
    status: 'Connected',
    categories: validCategories.length,
    products: validProducts.length,
    brands: validCategories.map(c => c.name)
  });
});

app.get('/api/categories', (req, res) => {
  res.json(validCategories);
});

app.get('/api/products', (req, res) => {
  res.json(validProducts);
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  
  // Handle undefined or invalid IDs
  if (!productId || productId === 'undefined' || productId === 'null') {
    console.log(`Invalid product ID requested: ${productId}`);
    return res.status(400).json({ error: 'Invalid product ID' });
  }
  
  const product = validProducts.find(p => p._id === productId);
  if (!product) {
    console.log(`Product not found for ID: ${productId}`);
    return res.status(404).json({ error: 'Product not found', requestedId: productId });
  }
  
  res.json(product);
});

app.post('/api/auth/register', (req, res) => {
  res.json({ 
    message: 'Registration endpoint - Connect MongoDB for full functionality',
    user: { id: '1', name: 'Demo User', email: 'demo@example.com', is_admin: false },
    token: 'demo-token'
  });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ 
    message: 'Login endpoint - Connect MongoDB for full functionality',
    user: { id: '1', name: 'Demo User', email: 'demo@example.com', is_admin: false },
    token: 'demo-token'
  });
});

app.post('/api/orders', (req, res) => {
  res.json({ 
    orderId: 'demo-order-123',
    message: 'Order endpoint - Connect MongoDB for full functionality'
  });
});

app.get('/api/admin/orders', (req, res) => {
  res.json([
    {
      _id: 'demo-order-1',
      customer_name: 'Demo Customer',
      customer_email: 'customer@demo.com',
      total: 25000,
      status: 'pending',
      createdAt: new Date(),
      items: []
    }
  ]);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dragon Lap Backend with REAL DATA running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should be running on http://localhost:3000`);
  console.log('');
  console.log('✅ Real laptop data loaded:');
  console.log(`   📂 Categories: ${validCategories.length} (${validCategories.map(c => c.name).join(', ')})`);
  console.log(`   💻 Products: ${validProducts.length} laptops`);
  console.log('');
  console.log('Available API endpoints:');
  console.log('  GET  /api - API status with data summary');
  console.log('  GET  /api/categories - Real laptop brands');
  console.log('  GET  /api/products - All your real laptops');
  console.log('  GET  /api/products/:id - Single laptop details');
  console.log('  POST /api/auth/register - User registration');
  console.log('  POST /api/auth/login - User login');
  console.log('  POST /api/orders - Place order');
  console.log('  GET  /api/admin/orders - Admin orders');
  console.log('');
  console.log('🎯 Your actual laptop inventory is now loaded!');
});

module.exports = app;