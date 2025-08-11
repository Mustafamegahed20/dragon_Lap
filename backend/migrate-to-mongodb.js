const sqlite3 = require('sqlite3').verbose();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Import models
const Category = require('./models/Category');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const Review = require('./models/Review');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dragonlap', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Connect to SQLite
const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('SQLite connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Migration functions
const migrateCategories = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM categories', async (err, rows) => {
      if (err) {
        console.error('Error fetching categories:', err);
        return reject(err);
      }
      
      try {
        console.log(`Migrating ${rows.length} categories...`);
        
        for (const row of rows) {
          const category = new Category({
            _id: new mongoose.Types.ObjectId(), // Create new ObjectId
            name: row.name
          });
          
          await category.save();
          console.log(`Migrated category: ${row.name}`);
        }
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const migrateProducts = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM products', async (err, rows) => {
      if (err) {
        console.error('Error fetching products:', err);
        return reject(err);
      }
      
      try {
        console.log(`Migrating ${rows.length} products...`);
        
        // Get all categories to map IDs
        const categories = await Category.find({});
        
        for (const row of rows) {
          const product = new Product({
            name: row.name,
            description: row.description,
            price: row.price,
            image: row.image,
            category_id: row.category_id ? categories[0]?._id : null, // Simple mapping - you may want to improve this
            cpu: row.cpu,
            ram: row.ram,
            storage: row.storage,
            graphics: row.graphics,
            screen_size: row.screen_size,
            operating_system: row.operating_system,
            weight: row.weight,
            battery: row.battery
          });
          
          await product.save();
          console.log(`Migrated product: ${row.name}`);
        }
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const migrateUsers = () => {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM users', async (err, rows) => {
      if (err) {
        console.error('Error fetching users:', err);
        return reject(err);
      }
      
      try {
        console.log(`Migrating ${rows.length} users...`);
        
        for (const row of rows) {
          const user = new User({
            name: row.name,
            email: row.email,
            password: row.password, // Already hashed
            is_admin: Boolean(row.is_admin)
          });
          
          await user.save();
          console.log(`Migrated user: ${row.email}`);
        }
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  });
};

const migrateOrders = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        o.*,
        GROUP_CONCAT(oi.product_id || ':' || oi.quantity || ':' || oi.price) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
    `;
    
    db.all(query, async (err, rows) => {
      if (err) {
        console.error('Error fetching orders:', err);
        return reject(err);
      }
      
      try {
        console.log(`Migrating ${rows.length} orders...`);
        
        // Get all users and products for reference
        const users = await User.find({});
        const products = await Product.find({});
        
        for (const row of rows) {
          // Parse items
          const items = [];
          if (row.items) {
            const itemStrings = row.items.split(',');
            for (const itemString of itemStrings) {
              const [productId, quantity, price] = itemString.split(':');
              if (productId && quantity && price) {
                items.push({
                  product_id: products[0]?._id || new mongoose.Types.ObjectId(), // Simple mapping
                  quantity: parseInt(quantity),
                  price: parseFloat(price)
                });
              }
            }
          }
          
          const order = new Order({
            user_id: row.user_id ? users.find(u => u.email)._id : null, // Simple mapping
            customer_name: row.customer_name || 'Unknown',
            customer_email: row.customer_email || 'unknown@example.com',
            total: row.total,
            address: row.address || 'No address provided',
            status: row.status || 'pending',
            items: items
          });
          
          await order.save();
          console.log(`Migrated order: ${row.id}`);
        }
        
        resolve(rows);
      } catch (error) {
        reject(error);
      }
    });
  });
};

// Main migration function
const runMigration = async () => {
  try {
    await connectDB();
    
    console.log('Starting migration from SQLite to MongoDB...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing MongoDB data');
    
    // Run migrations
    await migrateCategories();
    await migrateProducts();
    await migrateUsers();
    await migrateOrders();
    
    console.log('Migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    // Close connections
    db.close();
    mongoose.connection.close();
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };