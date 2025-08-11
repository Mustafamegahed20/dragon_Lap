const connectDB = require('../../lib/mongodb');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { rateLimitAuth, validateEmail, authAttempts } = require('../../lib/auth');

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
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
      authAttempts.delete(ip);
      
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
}