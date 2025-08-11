const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./config/database');

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Review = require('./models/Review');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    // Allow localhost requests on any port during development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    
    // Allow specific production origins
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Rate limiting for auth endpoints (simple implementation)
const authAttempts = new Map();
const rateLimitAuth = (req, res, next) => {
  const ip = req.ip;
  const attempts = authAttempts.get(ip) || { count: 0, lastAttempt: Date.now() };
  
  // Reset if 15 minutes have passed
  if (Date.now() - attempts.lastAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
  }
  
  if (attempts.count >= 5) {
    return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
  }
  
  authAttempts.set(ip, { count: attempts.count + 1, lastAttempt: Date.now() });
  next();
};

// MongoDB is now connected via connectDB() function

// Test route
app.get('/', (req, res) => {
  res.send('Dragon Lap API is running!');
});

// API: Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).populate('category_id', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Get product by id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category_id', 'name');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Input validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Register endpoint
app.post('/api/auth/register', rateLimitAuth, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Enhanced validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    if (name.length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters long' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    if (!validatePassword(password)) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email address already registered' });
    }
    
    const hash = bcrypt.hashSync(password, 12);
    
    const user = new User({
      name,
      email,
      password: hash,
      is_admin: false
    });
    
    await user.save();
    
    const userData = { id: user._id, name: user.name, email: user.email, is_admin: user.is_admin };
    const token = jwt.sign(userData, process.env.JWT_SECRET || 'dragonlap_secret_key', { expiresIn: '7d' });
    
    console.log(`New user registered: ${email}`);
    res.status(201).json({ user: userData, token, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login endpoint
app.post('/api/auth/login', rateLimitAuth, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log(`Failed login attempt for non-existent user: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!bcrypt.compareSync(password, user.password)) {
      console.log(`Failed login attempt for user: ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Remove password from user data
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin
    };
    const token = jwt.sign(userData, process.env.JWT_SECRET || 'dragonlap_secret_key', { expiresIn: '7d' });
    
    console.log(`Successful login: ${email}`);
    
    // Reset auth attempts on successful login
    authAttempts.delete(req.ip);
    
    res.json({ 
      user: userData, 
      token, 
      message: 'Login successful',
      expiresIn: '7d'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dragonlap_secret_key');
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Admin middleware
function adminMiddleware(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Optional auth middleware for guest checkout
const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.user = null;
    return next();
  }
  
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dragonlap_secret_key');
    req.user = decoded;
    next();
  } catch {
    req.user = null;
    next();
  }
};

// Place order endpoint (supports both authenticated and guest users)
app.post('/api/orders', optionalAuthMiddleware, async (req, res) => {
  try {
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

// Admin: Get all orders with details
app.get('/api/admin/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
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

// Admin: Update order status
app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 