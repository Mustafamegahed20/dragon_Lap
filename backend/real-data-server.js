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

// Initialize orders storage
let orders = [];
let orderIdCounter = 1;
try {
  if (fs.existsSync('orders.json')) {
    const ordersData = JSON.parse(fs.readFileSync('orders.json', 'utf8'));
    orders = ordersData.orders || [];
    orderIdCounter = ordersData.orderIdCounter || 1;
  }
} catch (error) {
  console.log('Creating new orders.json file');
  orders = [];
  orderIdCounter = 1;
}

// Clean up categories (remove invalid ones and duplicates)
const cleanedCategories = categories.filter(cat => 
  cat.name !== 'BRAND' && cat.name.length > 1
).map(cat => ({
  ...cat,
  name: cat.name === 'DELLL' ? 'DELL' : cat.name
}));

// Remove duplicates by name
const validCategories = cleanedCategories.filter((cat, index, self) => 
  index === self.findIndex(c => c.name === cat.name)
);

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
  
  console.log(`Looking for product with ID: ${productId}`);
  console.log(`Total products available: ${validProducts.length}`);
  
  const product = validProducts.find(p => p._id === productId);
  if (!product) {
    console.log(`Product not found for ID: ${productId}`);
    console.log(`Available product IDs: ${validProducts.map(p => p._id).join(', ')}`);
    return res.status(404).json({ error: 'Product not found', requestedId: productId });
  }
  
  console.log(`Found product: ${product.name}`);
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
  const { email, password } = req.body;
  
  // Simple demo authentication - admin user
  if (email === 'admin@dragonlap.com' && password === 'admin123') {
    res.json({ 
      message: 'Login successful - Admin user',
      user: { 
        id: 'admin-1', 
        name: 'Admin User', 
        email: 'admin@dragonlap.com', 
        is_admin: true 
      },
      token: 'admin-token'
    });
    return;
  }
  
  // Regular demo user
  res.json({ 
    message: 'Login endpoint - Connect MongoDB for full functionality',
    user: { id: '1', name: 'Demo User', email: email || 'demo@example.com', is_admin: false },
    token: 'demo-token'
  });
});

app.post('/api/orders', (req, res) => {
  const { items, customer_name, customer_email, address, total } = req.body;
  
  // Create new order
  const newOrder = {
    _id: `order-${orderIdCounter}`,
    customer_name,
    customer_email,
    address,
    total: parseFloat(total),
    status: 'pending',
    items: items.map(item => ({
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      price: parseFloat(item.price),
      cost_price: parseFloat(item.cost_price || 0)
    })),
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  orderIdCounter++;
  
  // Save orders to file
  try {
    fs.writeFileSync('orders.json', JSON.stringify({ orders, orderIdCounter }, null, 2));
    console.log(`✅ New order placed: ${newOrder._id}`);
  } catch (error) {
    console.error('Error saving order:', error);
  }
  
  res.json({ 
    orderId: newOrder._id,
    message: 'Order placed successfully',
    order: newOrder
  });
});

app.get('/api/admin/orders', (req, res) => {
  res.json(orders);
});

// Admin analytics endpoints
app.get('/api/admin/analytics', (req, res) => {
  // Calculate analytics based on current data
  const totalProducts = validProducts.length;
  const totalCategories = validCategories.length;
  
  // Calculate real sales data from orders
  const completedOrders = orders.filter(order => order.status === 'delivered');
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
  
  // Calculate profit from completed orders
  const totalProfit = completedOrders.reduce((profit, order) => {
    const orderProfit = order.items.reduce((itemProfit, item) => {
      const profitPerItem = (item.price - (item.cost_price || 0)) * item.quantity;
      return itemProfit + profitPerItem;
    }, 0);
    return profit + orderProfit;
  }, 0);
  
  // Calculate monthly revenue (current month)
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = completedOrders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
  
  const salesData = {
    totalRevenue: totalRevenue,
    totalProfit: totalProfit,
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrders.length,
    monthlyRevenue: monthlyRevenue,
    dailyRevenue: Math.round(monthlyRevenue / new Date().getDate()),
    profitMargin: totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : 0,
    topSellingCategory: 'DELL', // Could be calculated from order data
    lowStockProducts: validProducts.filter(p => (p.quantity || 0) < 10).length,
    outOfStockProducts: validProducts.filter(p => (p.quantity || 0) === 0).length
  };
  
  // Product stock analysis
  const stockAnalysis = validProducts.map(product => ({
    id: product._id,
    name: product.name,
    category: product.category_id.name,
    price: product.price,
    stock: product.quantity || Math.floor(Math.random() * 50) + 1, // Use actual quantity or random stock for demo
    sales: Math.floor(Math.random() * 100) + 5 // Random sales for demo
  })).sort((a, b) => b.sales - a.sales);
  
  // Category breakdown
  const categoryStats = validCategories.map(category => {
    const categoryProducts = validProducts.filter(p => p.category_id.name === category.name);
    return {
      name: category.name,
      productCount: categoryProducts.length,
      averagePrice: categoryProducts.length > 0 
        ? Math.round(categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length)
        : 0,
      revenue: Math.floor(Math.random() * 500000) + 50000 // Mock revenue
    };
  });
  
  // Monthly sales trend (mock data)
  const monthlySales = [
    { month: 'Jan', revenue: 180000, orders: 89 },
    { month: 'Feb', revenue: 220000, orders: 112 },
    { month: 'Mar', revenue: 195000, orders: 98 },
    { month: 'Apr', revenue: 285000, orders: 145 },
    { month: 'May', revenue: 310000, orders: 167 },
    { month: 'Jun', revenue: 275000, orders: 139 },
    { month: 'Jul', revenue: 320000, orders: 178 },
    { month: 'Aug', revenue: 285000, orders: 149 }
  ];
  
  res.json({
    overview: {
      totalProducts,
      totalCategories,
      ...salesData
    },
    topProducts: stockAnalysis.slice(0, 10),
    lowStockProducts: stockAnalysis.filter(p => p.stock < 10),
    categoryStats,
    monthlySales,
    lastUpdated: new Date().toISOString()
  });
});

// Admin product management endpoints
app.post('/api/admin/products', (req, res) => {
  const { name, description, price, cost_price, quantity, category_id, image, images, cpu, ram, storage, graphics, screen_size, operating_system, weight, battery } = req.body;
  
  // Basic validation
  if (!name || !price || !cost_price || !category_id || !quantity) {
    return res.status(400).json({ error: 'Name, price, cost price, quantity, and category are required' });
  }
  
  // Generate new ID - find the maximum existing ID and add 1
  const existingIds = validProducts.map(p => parseInt(p._id)).filter(id => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = (maxId + 1).toString();
  
  // Find category by ID or name
  const category = validCategories.find(cat => cat._id === category_id || cat.name === category_id);
  if (!category) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  
  const newProduct = {
    _id: newId,
    name,
    description: description || '',
    price: parseFloat(price),
    cost_price: parseFloat(cost_price),
    quantity: parseInt(quantity),
    image: image || '/images/laptops/placeholder-laptop.jpg',
    images: images && images.length > 0 ? images : [image || '/images/laptops/placeholder-laptop.jpg'],
    category_id: {
      _id: category._id,
      name: category.name
    },
    cpu: cpu || '',
    ram: ram || '',
    storage: storage || '',
    graphics: graphics || '',
    screen_size: screen_size || '',
    operating_system: operating_system || '',
    weight: weight || '',
    battery: battery || ''
  };
  
  validProducts.push(newProduct);
  
  // Update the JSON file
  try {
    fs.writeFileSync('processed-products.json', JSON.stringify(validProducts, null, 2));
    console.log(`✅ Added new product: ${name}`);
  } catch (error) {
    console.error('Error saving product to file:', error);
  }
  
  res.json({ message: 'Product added successfully', product: newProduct });
});

app.put('/api/admin/products/:id', (req, res) => {
  const productId = req.params.id;
  console.log(`🔄 Updating product ID: ${productId}`);
  const { name, description, price, cost_price, quantity, category_id, image, images, cpu, ram, storage, graphics, screen_size, operating_system, weight, battery } = req.body;
  
  console.log(`📝 Request data:`, { name, price, cost_price, quantity, category_id });
  
  // Find product to edit
  const productIndex = validProducts.findIndex(p => p._id === productId);
  console.log(`🔍 Product found at index: ${productIndex}`);
  
  if (productIndex === -1) {
    console.log(`❌ Product not found with ID: ${productId}`);
    console.log(`📋 Available product IDs: ${validProducts.map(p => p._id).join(', ')}`);
    return res.status(404).json({ error: 'Product not found' });
  }
  
  // Basic validation - make cost_price optional for existing products
  if (!name || !price || !category_id || !quantity) {
    console.log(`❌ Validation failed:`, { name: !!name, price: !!price, category_id: !!category_id, quantity: !!quantity });
    return res.status(400).json({ error: 'Name, price, quantity, and category are required' });
  }
  
  // Find category by ID or name
  const category = validCategories.find(cat => cat._id === category_id || cat.name === category_id);
  if (!category) {
    return res.status(400).json({ error: 'Invalid category' });
  }
  
  // Update the product
  const updatedProduct = {
    _id: productId, // Keep the same ID
    name,
    description: description || '',
    price: parseFloat(price),
    cost_price: parseFloat(cost_price || 0),
    quantity: parseInt(quantity),
    image: image || '/images/laptops/placeholder-laptop.jpg',
    images: images && images.length > 0 ? images : [image || '/images/laptops/placeholder-laptop.jpg'],
    category_id: {
      _id: category._id,
      name: category.name
    },
    cpu: cpu || '',
    ram: ram || '',
    storage: storage || '',
    graphics: graphics || '',
    screen_size: screen_size || '',
    operating_system: operating_system || '',
    weight: weight || '',
    battery: battery || ''
  };
  
  validProducts[productIndex] = updatedProduct;
  
  // Update the JSON file
  try {
    fs.writeFileSync('processed-products.json', JSON.stringify(validProducts, null, 2));
    console.log(`✏️ Updated product: ${name}`);
  } catch (error) {
    console.error('Error saving product to file:', error);
  }
  
  res.json({ message: 'Product updated successfully', product: updatedProduct });
});

app.delete('/api/admin/products/:id', (req, res) => {
  const productId = req.params.id;
  const productIndex = validProducts.findIndex(p => p._id === productId);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const deletedProduct = validProducts[productIndex];
  validProducts.splice(productIndex, 1);
  
  // Update the JSON file
  try {
    fs.writeFileSync('processed-products.json', JSON.stringify(validProducts, null, 2));
    console.log(`🗑️ Deleted product: ${deletedProduct.name}`);
  } catch (error) {
    console.error('Error saving products to file:', error);
  }
  
  res.json({ message: 'Product deleted successfully', product: deletedProduct });
});

// Update order status endpoint
app.put('/api/admin/orders/:id/status', (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  
  // Valid status values
  const validStatuses = ['pending', 'confirmed', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  
  // Find and update the order
  const orderIndex = orders.findIndex(order => order._id === orderId);
  
  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  orders[orderIndex].status = status;
  
  // Save orders to file
  try {
    fs.writeFileSync('orders.json', JSON.stringify(orders, null, 2));
    console.log(`📋 Updated order ${orderId} status to: ${status}`);
  } catch (error) {
    console.error('Error saving orders to file:', error);
    return res.status(500).json({ error: 'Failed to save order update' });
  }
  
  res.json({ 
    message: 'Order status updated successfully', 
    order: orders[orderIndex] 
  });
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
  console.log('  GET  /api/admin/analytics - Admin dashboard analytics');
  console.log('  POST /api/admin/products - Add new product (admin)');
  console.log('  PUT  /api/admin/products/:id - Edit product (admin)');
  console.log('  DELETE /api/admin/products/:id - Delete product (admin)');
  console.log('  PUT  /api/admin/orders/:id/status - Update order status (admin)');
  console.log('');
  console.log('🎯 Your actual laptop inventory is now loaded!');
});

module.exports = app;