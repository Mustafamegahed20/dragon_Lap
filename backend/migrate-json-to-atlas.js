const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// MongoDB Atlas connection string (@ symbol URL encoded as %40)
const MONGODB_URI = 'mongodb+srv://mustafa-megahed:%40Mmg2841999@cluster0.eqgdedh.mongodb.net/dragonlap?retryWrites=true&w=majority&appName=Cluster0';

// Define schemas (without _id to let MongoDB auto-generate)
const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
}, { collection: 'categories' });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  cost_price: Number,
  quantity: Number,
  category_id: String,
  image: String,
  images: [String],
  cpu: String,
  ram: String,
  storage: String,
  graphics: String,
  screen_size: String,
  operating_system: String,
  weight: String,
  battery: String,
  brand: String,
  model: String,
  condition: String,
  year: Number,
  specifications: Object
}, { collection: 'products' });

const Category = mongoose.model('Category', categorySchema);
const Product = mongoose.model('Product', productSchema);

async function migrateData() {
  try {
    console.log('🔌 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');

    // Read JSON files
    console.log('📂 Reading JSON data files...');
    const categoriesData = JSON.parse(fs.readFileSync('./processed-categories.json', 'utf8'));
    const productsData = JSON.parse(fs.readFileSync('./processed-products.json', 'utf8'));

    console.log(`📊 Found ${categoriesData.length} categories and ${productsData.length} products`);

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Insert categories (clean data)
    console.log('📂 Inserting categories...');
    const cleanCategories = categoriesData.map(cat => {
      const { _id, ...cleanCat } = cat; // Remove _id field
      return cleanCat;
    });
    await Category.insertMany(cleanCategories);
    console.log(`✅ Inserted ${cleanCategories.length} categories`);

    // Insert products (clean data)
    console.log('💻 Inserting products...');
    const cleanProducts = productsData.map(product => {
      const { _id, ...cleanProduct } = product; // Remove _id field
      return {
        ...cleanProduct,
        price: Number(cleanProduct.price) || 0,
        cost_price: Number(cleanProduct.cost_price) || 0,
        quantity: Number(cleanProduct.quantity) || 0,
        year: cleanProduct.year ? Number(cleanProduct.year) : null
      };
    });
    await Product.insertMany(cleanProducts);
    console.log(`✅ Inserted ${cleanProducts.length} products`);

    console.log('🎉 Migration completed successfully!');
    
    // Verify data
    const categoryCount = await Category.countDocuments();
    const productCount = await Product.countDocuments();
    console.log(`📊 Verification: ${categoryCount} categories, ${productCount} products in database`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run migration
migrateData();