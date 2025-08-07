const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Fixing null brands by extracting from product names...');

// Get products with null brands
db.all('SELECT id, name FROM products WHERE brand IS NULL OR brand = ""', (err, products) => {
    if (err) {
        console.error('Error fetching products with null brands:', err.message);
        db.close();
        return;
    }
    
    console.log(`Found ${products.length} products with null/empty brands`);
    
    let processed = 0;
    let errors = 0;
    
    products.forEach(product => {
        const name = product.name.toLowerCase();
        let brand = '';
        
        // Extract brand from product name
        if (name.includes('dell')) {
            brand = 'DELL';
        } else if (name.includes('hp')) {
            brand = 'HP';
        } else if (name.includes('lenovo')) {
            brand = 'LENOVO';
        } else if (name.includes('acer')) {
            brand = 'ACER';
        } else {
            // Try to extract first word as brand
            const firstWord = product.name.split(' ')[0].toUpperCase();
            if (firstWord.length > 1) {
                brand = firstWord;
            } else {
                brand = 'UNKNOWN';
            }
        }
        
        db.run('UPDATE products SET brand = ? WHERE id = ?', [brand, product.id], function(err) {
            if (err) {
                console.error(`❌ Error updating brand for ${product.name}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Updated: ${product.name} -> ${brand}`);
                processed++;
            }
            
            // Check if all products are processed
            if (processed + errors === products.length) {
                console.log(`\\n🎉 Brand fixing complete!`);
                console.log(`✅ Successfully updated: ${processed} products`);
                console.log(`❌ Errors: ${errors} products`);
                
                // Show final brand distribution
                db.all('SELECT DISTINCT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY brand', (err, brands) => {
                    if (err) {
                        console.error('Error fetching final brands:', err.message);
                    } else {
                        console.log('\\nFinal brand distribution:');
                        brands.forEach(brand => {
                            console.log(`- ${brand.brand}: ${brand.count} laptops`);
                        });
                    }
                    db.close();
                });
            }
        });
    });
    
    if (products.length === 0) {
        console.log('No products with null brands found!');
        db.close();
    }
});