const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

// Simple product list without specifications for now
const products = [
  {
    name: 'HP EliteBook 745 G2',
    price: 6000,
    image: 'https://ghost-technology-eg.com/uploads/products/102_1.jpg',
    description: 'Business laptop with AMD processor and professional features',
    category: 'HP',
  },
  {
    name: 'HP EliteBook MT42',
    price: 7000,
    image: 'https://ghost-technology-eg.com/uploads/products/103_1.png',
    description: 'Reliable business laptop with enhanced security features',
    category: 'HP',
  },
  {
    name: 'HP EliteBook 745 G3',
    price: 7000,
    image: 'https://ghost-technology-eg.com/uploads/products/105_1.png',
    description: 'Advanced business laptop with improved performance',
    category: 'HP',
  },
  {
    name: 'HP Pavilion 15',
    price: 7500,
    image: 'https://ghost-technology-eg.com/uploads/products/104_1.jpg',
    description: 'Consumer laptop perfect for everyday computing needs',
    category: 'HP',
  },
  {
    name: 'HP ProBook 450 G5',
    price: 8500,
    image: 'https://ghost-technology-eg.com/uploads/products/105_1.jpg',
    description: 'Professional laptop with excellent build quality',
    category: 'HP',
  },
  {
    name: 'HP EliteBook 840 G5',
    price: 12000,
    image: '',
    description: 'Premium business laptop with top-tier performance',
    category: 'HP',
  },
  {
    name: 'HP ZBook 15 G3',
    price: 18000,
    image: '',
    description: 'Mobile workstation for professional graphics work',
    category: 'HP',
  },
  {
    name: 'Dell Latitude 6540',
    price: 6000,
    image: 'https://ghost-technology-eg.com/uploads/products/45_1.jpg',
    description: 'Reliable business laptop with enterprise features',
    category: 'DELL',
  },
  {
    name: 'Dell Precision 7740',
    price: 17500,
    image: '',
    description: 'High-performance mobile workstation for demanding tasks',
    category: 'DELL',
  },
  {
    name: 'Dell Precision 7730',
    price: 25000,
    image: '',
    description: 'Ultimate mobile workstation with professional graphics',
    category: 'DELL',
  },
  {
    name: 'Dell Precision 7720',
    price: 22000,
    image: '',
    description: 'Professional workstation laptop for creative professionals',
    category: 'DELL',
  },
  {
    name: 'Dell XPS 13',
    price: 28000,
    image: '',
    description: 'Premium ultrabook with stunning InfinityEdge display',
    category: 'DELL',
  },
  {
    name: 'Dell Inspiron 15 3000',
    price: 9500,
    image: '',
    description: 'Affordable laptop for students and everyday use',
    category: 'DELL',
  },
  {
    name: 'Dell Latitude 7420',
    price: 15000,
    image: '',
    description: 'Business laptop with excellent security and performance',
    category: 'DELL',
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon',
    price: 32000,
    image: '',
    description: 'Ultra-lightweight business laptop with carbon fiber construction',
    category: 'LENOVO',
  },
  {
    name: 'Lenovo ThinkPad T480',
    price: 14000,
    image: '',
    description: 'Classic business laptop with legendary ThinkPad reliability',
    category: 'LENOVO',
  },
  {
    name: 'Lenovo IdeaPad 3 15',
    price: 8000,
    image: '',
    description: 'Affordable laptop for home and office productivity',
    category: 'LENOVO',
  },
  {
    name: 'Lenovo Yoga 720',
    price: 16000,
    image: '',
    description: '2-in-1 convertible laptop with touchscreen display',
    category: 'LENOVO',
  },
  {
    name: 'Lenovo Legion Y540',
    price: 19000,
    image: '',
    description: 'Gaming laptop with powerful graphics and performance',
    category: 'LENOVO',
  },
  {
    name: 'Acer Aspire 5',
    price: 7200,
    image: '',
    description: 'Budget-friendly laptop with solid performance',
    category: 'ACER',
  },
  {
    name: 'Acer Swift 3',
    price: 11000,
    image: '',
    description: 'Lightweight laptop perfect for professionals on the go',
    category: 'ACER',
  },
  {
    name: 'Acer Predator Helios 300',
    price: 24000,
    image: '',
    description: 'High-performance gaming laptop with RGB keyboard',
    category: 'ACER',
  },
  {
    name: 'Acer Nitro 5',
    price: 13500,
    image: '',
    description: 'Gaming laptop with excellent price-to-performance ratio',
    category: 'ACER',
  }
];

console.log('Restoring products without specifications...');

db.serialize(() => {
  let remaining = products.length;
  
  if (remaining === 0) {
    console.log('No products to restore');
    db.close();
    return;
  }

  products.forEach(product => {
    // Normalize category name to match database
    const categoryName = product.category.toUpperCase();
    
    db.get('SELECT id FROM categories WHERE name = ?', [categoryName], (err, row) => {
      if (row) {
        db.run(
          'INSERT INTO products (name, description, price, image, category_id) VALUES (?, ?, ?, ?, ?)',
          [
            product.name, 
            product.description, 
            product.price, 
            product.image, 
            row.id
          ],
          (err) => {
            if (err) {
              console.error('Error inserting product:', product.name, err);
            } else {
              console.log(`✓ Inserted: ${product.name}`);
            }
            
            remaining--;
            if (remaining === 0) {
              console.log('\n🎉 All products restored successfully!');
              db.close();
            }
          }
        );
      } else {
        console.error(`Category not found: ${categoryName}`);
        remaining--;
        if (remaining === 0) {
          console.log('\n🎉 Product restoration completed!');
          db.close();
        }
      }
    });
  });
});