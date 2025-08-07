const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { generateLaptopSpecs } = require('./laptop-specs');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

// Helper to infer category from product name
function inferCategory(name) {
  if (/hp|elitebook|probook|zbook/i.test(name)) return 'HP';
  if (/dell|latitude|precision|inspiron|xps/i.test(name)) return 'Dell';
  if (/lenovo|thinkpad|ideapad|yoga/i.test(name)) return 'Lenovo';
  if (/macbook|apple/i.test(name)) return 'Apple';
  return 'Accessories';
}

// All products from the HTML (truncated for brevity, add all as needed)
const products = [
  {
    name: 'HP EliteBook 745 G2',
    price: 6000,
    image: 'https://ghost-technology-eg.com/uploads/products/102_1.jpg',
    stock: 'Out of Stock',
    description: '',
    category: 'HP',
  },
  {
    name: 'HP EliteBook MT42',
    price: 7000,
    image: 'https://ghost-technology-eg.com/uploads/products/103_1.png',
    stock: 'Out of Stock',
    description: '',
    category: 'HP',
  },
  {
    name: 'HP EliteBook 745 G3',
    price: 7000,
    image: 'https://ghost-technology-eg.com/uploads/products/105_1.png',
    stock: 'Out of Stock',
    description: '',
    category: 'HP',
  },
  {
    name: 'Dell Latitude 6540',
    price: 6000,
    image: 'https://ghost-technology-eg.com/uploads/products/45_1.jpg',
    stock: 'Out of Stock',
    description: '',
    category: 'Dell',
  },
  {
    name: 'DELL PRE 7740',
    price: 17500,
    image: '',
    stock: 'In Stock: 1',
    description: '',
    category: 'DELL',
  },
  {
    name: 'DELL PRE 7730',
    price: 25000,
    image: '',
    stock: 'In Stock: 2',
    description: '',
    category: 'DELL',
  },
  {
    name: 'DELL PRE 7730',
    price: 21000,
    image: '',
    stock: 'In Stock: 1',
    description: '',
    category: 'DELL',
  },
  {
    name: 'DELL PRE 7730',
    price: 18500,
    image: '',
    stock: 'In Stock: 1',
    description: '',
    category: 'DELL',
  },
  {
    name: 'DELL PRE 7720',
    price: 22000,
    image: '',
    stock: 'In Stock: 1',
    description: '',
    category: 'DELL',
  },
  {
    name: 'DELL XPS 13',
    price: 28000,
    image: '',
    stock: 'In Stock: 3',
    description: '',
    category: 'DELL',
  },
  {
    name: 'HP EliteBook 745 G2',
    price: 6000,
    image: 'https://ghost-technology-eg.com/uploads/products/102_1.jpg',
    stock: 'Out of Stock',
    description: '',
    category: 'HP',
  },
  {
    name: 'HP EliteBook MT42',
    price: 7000,
    image: 'https://ghost-technology-eg.com/uploads/products/103_1.png',
    stock: 'Out of Stock',
    description: '',
    category: 'HP',
  },
  {
    name: 'HP Pavilion 15',
    price: 7500,
    image: 'https://ghost-technology-eg.com/uploads/products/104_1.jpg',
    stock: 'In Stock: 4',
    description: '',
    category: 'HP',
  },
  {
    name: 'HP ProBook 450 G5',
    price: 8500,
    image: 'https://ghost-technology-eg.com/uploads/products/105_1.jpg',
    stock: 'In Stock: 2',
    description: '',
    category: 'HP',
  },
  {
    name: 'Lenovo ThinkPad T470',
    price: 10000,
    image: 'https://ghost-technology-eg.com/uploads/products/106_1.jpg',
    stock: 'In Stock: 3',
    description: '',
    category: 'Lenovo',
  },
  {
    name: 'Lenovo IdeaPad 330',
    price: 12000,
    image: 'https://ghost-technology-eg.com/uploads/products/107_1.jpg',
    stock: 'In Stock: 2',
    description: '',
    category: 'Lenovo',
  },
  {
    name: 'Acer Swift 3',
    price: 13000,
    image: 'https://ghost-technology-eg.com/uploads/products/108_1.jpg',
    stock: 'In Stock: 5',
    description: '',
    category: 'Acer',
  },
  {
    name: 'Acer Aspire 5',
    price: 14000,
    image: 'https://ghost-technology-eg.com/uploads/products/109_1.jpg',
    stock: 'In Stock: 6',
    description: '',
    category: 'Acer',
  }
];

// Seed categories first
const uniqueCategories = [...new Set(products.map(p => p.category))];
db.serialize(() => {
  uniqueCategories.forEach(name => {
    const normalized = name.trim().toUpperCase(); // or use .toLowerCase() or capitalize
    db.run('INSERT OR IGNORE INTO categories (name) VALUES (?)', [normalized]);
  });

  let remaining = products.length;
  if (remaining === 0) {
    db.close();
    return;
  }

  products.forEach(product => {
    db.get('SELECT id FROM categories WHERE name = ?', [product.category], (err, row) => {
      if (row) {
        const specs = generateLaptopSpecs(product.name, product.price);
        db.run(
          'INSERT INTO products (name, description, price, image, category_id, cpu, ram, storage, graphics, screen_size, operating_system, weight, battery) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [product.name, product.description, product.price, product.image, row.id, specs.cpu, specs.ram, specs.storage, specs.graphics, specs.screen_size, specs.operating_system, specs.weight, specs.battery],
          () => {
            remaining--;
            if (remaining === 0) {
              console.log('Database seeded with Ghost Technology products!');
              db.close();
            }
          }
        );
      } else {
        remaining--;
        if (remaining === 0) {
          console.log('Database seeded with Ghost Technology products!');
          db.close();
        }
      }
    });
  });
}); 