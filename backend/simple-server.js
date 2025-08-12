const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data matching your original categories
const mockCategories = [
  { _id: '1', name: 'HP' },
  { _id: '2', name: 'Dell' },
  { _id: '3', name: 'Acer' },
  { _id: '4', name: 'Lenovo' }
];

const mockProducts = [
  {
    _id: '1',
    name: 'HP Pavilion Gaming 15',
    description: 'High-performance gaming laptop with NVIDIA graphics',
    price: 28000,
    image: '/images/laptops/hp-pavilion.jpg',
    category_id: { _id: '1', name: 'HP' },
    cpu: 'Intel Core i7-12700H',
    ram: '16GB DDR4',
    storage: '1TB NVMe SSD',
    graphics: 'NVIDIA GTX 1660 Ti',
    screen_size: '15.6" FHD 144Hz',
    operating_system: 'Windows 11',
    weight: '2.3kg',
    battery: '52.5Wh'
  },
  {
    _id: '2',
    name: 'Dell XPS 13',
    description: 'Premium ultrabook for professionals',
    price: 35000,
    image: '/images/laptops/dell-xps13.jpg',
    category_id: { _id: '2', name: 'Dell' },
    cpu: 'Intel Core i7-1365U',
    ram: '16GB LPDDR5',
    storage: '512GB NVMe SSD',
    graphics: 'Intel Iris Xe',
    screen_size: '13.4" FHD+',
    operating_system: 'Windows 11',
    weight: '1.2kg',
    battery: '51Wh'
  },
  {
    _id: '3',
    name: 'Acer Aspire 5',
    description: 'Affordable laptop for everyday computing',
    price: 18000,
    image: '/images/laptops/acer-aspire5.jpg',
    category_id: { _id: '3', name: 'Acer' },
    cpu: 'AMD Ryzen 5 5500U',
    ram: '8GB DDR4',
    storage: '256GB NVMe SSD',
    graphics: 'AMD Radeon Graphics',
    screen_size: '15.6" FHD',
    operating_system: 'Windows 11',
    weight: '1.7kg',
    battery: '50Wh'
  },
  {
    _id: '4',
    name: 'Lenovo ThinkPad X1 Carbon',
    description: 'Business laptop with premium build quality',
    price: 42000,
    image: '/images/laptops/lenovo-thinkpad.jpg',
    category_id: { _id: '4', name: 'Lenovo' },
    cpu: 'Intel Core i7-1355U',
    ram: '16GB LPDDR5',
    storage: '1TB NVMe SSD',
    graphics: 'Intel Iris Xe',
    screen_size: '14" WUXGA',
    operating_system: 'Windows 11 Pro',
    weight: '1.1kg',
    battery: '57Wh'
  }
];

// Routes
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Dragon Lap API is running locally!',
    status: 'Connected',
    note: 'Using mock data - Connect MongoDB for full functionality'
  });
});

app.get('/api/categories', (req, res) => {
  res.json(mockCategories);
});

app.get('/api/products', (req, res) => {
  res.json(mockProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = mockProducts.find(p => p._id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
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
  console.log(`🚀 Dragon Lap Backend running on http://localhost:${PORT}`);
  console.log(`📱 Frontend should be running on http://localhost:3000`);
  console.log('');
  console.log('Available API endpoints:');
  console.log('  GET  /api - API status');
  console.log('  GET  /api/categories - Product categories');
  console.log('  GET  /api/products - All products');
  console.log('  GET  /api/products/:id - Single product');
  console.log('  POST /api/auth/register - User registration');
  console.log('  POST /api/auth/login - User login');
  console.log('  POST /api/orders - Place order');
  console.log('  GET  /api/admin/orders - Admin orders');
  console.log('');
  console.log('💡 Note: Using mock data. Connect MongoDB for full functionality.');
});

module.exports = app;