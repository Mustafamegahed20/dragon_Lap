const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Fixing brand duplicates and inconsistencies...');

db.serialize(() => {
    // First, fix the typo "DELLL" to "DELL" in products table
    db.run('UPDATE products SET brand = "DELL" WHERE brand = "DELLL"', function(err) {
        if (err) {
            console.error('Error fixing DELLL brand:', err.message);
        } else {
            console.log(`✅ Fixed ${this.changes} products with DELLL -> DELL`);
        }
    });

    // Remove the duplicate "DELLL" category
    db.run('DELETE FROM categories WHERE name = "DELLL"', function(err) {
        if (err) {
            console.error('Error removing DELLL category:', err.message);
        } else {
            console.log(`✅ Removed duplicate DELLL category`);
        }
    });

    // Check the current categories after cleanup
    setTimeout(() => {
        db.all('SELECT DISTINCT name FROM categories ORDER BY name', (err, categories) => {
            if (err) {
                console.error('Error fetching categories:', err.message);
                return;
            }
            
            console.log('\\nCurrent categories after cleanup:');
            categories.forEach(cat => {
                console.log(`- ${cat.name}`);
            });
            
            // Check products by brand
            db.all('SELECT DISTINCT brand, COUNT(*) as count FROM products GROUP BY brand ORDER BY brand', (err, brands) => {
                if (err) {
                    console.error('Error fetching product brands:', err.message);
                    return;
                }
                
                console.log('\\nProducts by brand after cleanup:');
                brands.forEach(brand => {
                    console.log(`- ${brand.brand}: ${brand.count} laptops`);
                });
                
                console.log('\\n🎉 Brand cleanup complete!');
                db.close();
            });
        });
    }, 1000);
});