const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking brands in database...');

// Check unique brands in products table
db.all('SELECT DISTINCT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY brand', (err, brands) => {
    if (err) {
        console.error('Error fetching brands:', err.message);
        return;
    }
    
    console.log('\nBrands in products table:');
    brands.forEach(brand => {
        console.log(`- ${brand.brand}: ${brand.count} laptops`);
    });
    
    // Check categories table
    db.all('SELECT id, name FROM categories ORDER BY name', (err, categories) => {
        if (err) {
            console.error('Error fetching categories:', err.message);
            return;
        }
        
        console.log('\nCategories in database:');
        categories.forEach(cat => {
            console.log(`- ID: ${cat.id}, Name: ${cat.name}`);
        });
        
        db.close();
    });
});