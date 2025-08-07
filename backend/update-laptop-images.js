const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const imagesDir = path.join(__dirname, '../frontend/public/images/laptops');

console.log('Updating laptop images from local files...');

// Check if images directory exists
if (!fs.existsSync(imagesDir)) {
    console.log(`❌ Images directory not found: ${imagesDir}`);
    console.log('Please create the directory and add laptop images first.');
    process.exit(1);
}

const db = new sqlite3.Database(dbPath);

// Function to generate filename from product name
function generateFilename(productName) {
    return productName.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-') + '.jpg';
}

// Get all products
db.all('SELECT id, name, brand FROM products', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err.message);
        db.close();
        return;
    }
    
    console.log(`Processing ${products.length} products...`);
    
    let updated = 0;
    let notFound = 0;
    let processed = 0;
    
    products.forEach(product => {
        const filename = generateFilename(product.name);
        const imagePath = path.join(imagesDir, filename);
        
        // Check if image file exists (try both .jpg and .png)
        const jpgPath = imagePath;
        const pngPath = imagePath.replace('.jpg', '.png');
        
        let imageUrl = null;
        if (fs.existsSync(jpgPath)) {
            imageUrl = `/images/laptops/${filename}`;
        } else if (fs.existsSync(pngPath)) {
            imageUrl = `/images/laptops/${filename.replace('.jpg', '.png')}`;
        }
        
        if (imageUrl) {
            // Update database with image path
            db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(err) {
                if (err) {
                    console.error(`❌ Error updating ${product.name}:`, err.message);
                } else {
                    console.log(`✅ Updated: ${product.name} -> ${imageUrl}`);
                    updated++;
                }
                
                processed++;
                if (processed === products.length) {
                    console.log(`\\n🎉 Processing complete!`);
                    console.log(`✅ Updated: ${updated} products`);
                    console.log(`❌ Not found: ${notFound} products`);
                    db.close();
                }
            });
        } else {
            console.log(`⚠️  Image not found: ${product.name} (${filename})`);
            notFound++;
            processed++;
            
            if (processed === products.length) {
                console.log(`\\n🎉 Processing complete!`);
                console.log(`✅ Updated: ${updated} products`);
                console.log(`❌ Not found: ${notFound} products`);
                db.close();
            }
        }
    });
});