const connectDB = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { rateLimitAuth, validateEmail, validatePassword } = require('../../lib/auth');

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

  // Apply rate limiting
  rateLimitAuth(req, res, async () => {
    try {
      await connectDB();

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
}