import { MongoClient } from 'mongodb';

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mustafa-megahed:%40Mmg2841999@cluster0.eqgdedh.mongodb.net/dragonlap?retryWrites=true&w=majority&appName=Cluster0';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('dragonlap');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

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

  try {
    const { db } = await connectToDatabase();

    if (req.method === 'GET') {
      // Get all products
      const products = await db.collection('products').find({}).toArray();
      
      // Get categories for reference
      const categories = await db.collection('categories').find({}).toArray();
      const categoryMap = {};
      categories.forEach(cat => {
        categoryMap[cat._id?.toString()] = cat;
      });

      // Add category info to products
      const productsWithCategories = products.map(product => ({
        ...product,
        category_id: categoryMap[product.category_id] || { name: 'Unknown' }
      }));

      res.status(200).json(productsWithCategories);
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
}