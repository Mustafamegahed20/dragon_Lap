const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');

console.log('Fixing laptop images with working placeholder services...');

// Function to generate working image URL based on laptop brand and model
function generateWorkingImageUrl(name, brand) {
    const cleanBrand = (brand || 'laptop').toLowerCase();
    
    // Use different approaches for different brands
    if (cleanBrand.includes('dell')) {
        // Dell laptops - using picsum with a specific seed based on name
        const seed = name.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
        return `https://picsum.photos/seed/${seed}/400/300`;
    } else if (cleanBrand.includes('hp')) {
        // HP laptops - using a different picsum seed
        const seed = name.split('').reduce((a, b) => a + b.charCodeAt(0), 100);
        return `https://picsum.photos/seed/${seed}/400/300`;
    } else if (cleanBrand.includes('lenovo')) {
        // Lenovo laptops - using another seed range
        const seed = name.split('').reduce((a, b) => a + b.charCodeAt(0), 200);
        return `https://picsum.photos/seed/${seed}/400/300`;
    } else {
        // Generic laptop
        const seed = name.split('').reduce((a, b) => a + b.charCodeAt(0), 50);
        return `https://picsum.photos/seed/${seed}/400/300`;
    }
}

const db = new sqlite3.Database(dbPath);

console.log('Fetching all products to update images...');

db.all('SELECT id, name, brand FROM products', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err.message);
        db.close();
        return;
    }
    
    console.log(`Found ${products.length} products to update`);
    
    let processed = 0;
    let errors = 0;
    
    products.forEach((product, index) => {
        const imageUrl = generateWorkingImageUrl(product.name, product.brand);
        
        db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(err) {
            if (err) {
                console.error(`❌ Error updating image for ${product.name}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Updated image for: ${product.name}`);
                processed++;
            }
            
            // Check if all products are processed
            if (processed + errors === products.length) {
                console.log(`\\n🎉 Image update complete!`);
                console.log(`✅ Successfully updated: ${processed} laptops`);
                console.log(`❌ Errors: ${errors} laptops`);
                console.log('\\nImages now use Picsum Photos service which should load properly.');
                db.close();
            }
        });
    });
});