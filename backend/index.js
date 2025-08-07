const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

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

// SQLite DB setup
const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Could not connect to database', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Dragon Lap API is running!');
});

// API: Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Get all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// API: Get product by id
app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
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
app.post('/api/auth/register', rateLimitAuth, (req, res) => {
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
    
    const hash = bcrypt.hashSync(password, 12); // Increased salt rounds for better security
    
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hash], function(err) {
      if (err) {
        console.error('Registration error:', err);
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'Email address already registered' });
        }
        return res.status(500).json({ error: 'Registration failed. Please try again.' });
      }
      
      const user = { id: this.lastID, name, email, is_admin: 0 };
      const token = jwt.sign(user, process.env.JWT_SECRET || 'dragonlap_secret_key', { expiresIn: '7d' });
      
      console.log(`New user registered: ${email}`);
      res.status(201).json({ user, token, message: 'Registration successful' });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Login endpoint
app.post('/api/auth/login', rateLimitAuth, (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Enhanced validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Login database error:', err);
        return res.status(500).json({ error: 'Login failed. Please try again.' });
      }
      
      if (!user) {
        console.log(`Failed login attempt for non-existent user: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      if (!bcrypt.compareSync(password, user.password)) {
        console.log(`Failed login attempt for user: ${email}`);
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      
      // Remove password from user data
      const { password: _, ...userData } = user;
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
app.post('/api/orders', optionalAuthMiddleware, (req, res) => {
  const { items, total, address, customerInfo } = req.body;
  if (!items || !Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  
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
  
  db.run('INSERT INTO orders (user_id, customer_name, customer_email, total, address, status) VALUES (?, ?, ?, ?, ?, ?)', 
    [userId, customerName, customerEmail, total, addressString, 'pending'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    const orderId = this.lastID;
    const stmt = db.prepare('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)');
    items.forEach(item => {
      stmt.run(orderId, item.id, item.qty, item.price);
    });
    stmt.finalize();
    res.json({ orderId });
  });
});

// Admin: Get all orders with details
app.get('/api/admin/orders', authMiddleware, adminMiddleware, (req, res) => {
  try {
    // Simple approach: just get orders first, items can be fetched separately if needed
    const query = `
      SELECT 
        o.id,
        o.user_id,
        o.customer_name,
        o.customer_email,
        o.total,
        o.status,
        o.created_at,
        o.address
      FROM orders o
      ORDER BY o.created_at DESC
    `;
    
    db.all(query, (err, orders) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error: ' + err.message });
      }
      
      // For now, return orders without items to test basic functionality
      const ordersWithEmptyItems = orders.map(order => ({
        ...order,
        items: [] // We'll add items later once basic functionality works
      }));
      
      res.json(ordersWithEmptyItems);
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
});

// Admin: Update order status
app.put('/api/admin/orders/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
  
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 