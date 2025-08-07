const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');

console.log('Adding images to laptop products...');

// Function to generate image URL based on laptop brand and model
function generateImageUrl(name, brand) {
    const cleanName = name.toLowerCase().replace(/\s+/g, '-');
    const cleanBrand = brand.toLowerCase();
    
    // For now, we'll use placeholder images with specific laptop themes
    // In a real scenario, you would have actual laptop images in your public folder
    
    // Different placeholder services for variety
    const placeholders = [
        `https://via.placeholder.com/400x300/f0f0f0/333333?text=${encodeURIComponent(name)}`,
        `https://dummyimage.com/400x300/e8e8e8/555555&text=${encodeURIComponent(name)}`,
        `https://placehold.co/400x300/f5f5f5/666666?text=${encodeURIComponent(name)}`,
    ];
    
    // Assign different placeholder based on brand
    let placeholderIndex = 0;
    if (cleanBrand.includes('dell')) placeholderIndex = 0;
    else if (cleanBrand.includes('hp')) placeholderIndex = 1;
    else if (cleanBrand.includes('lenovo')) placeholderIndex = 2;
    
    return placeholders[placeholderIndex];
}

const db = new sqlite3.Database(dbPath);

console.log('Fetching all products without images...');

db.all('SELECT id, name, brand FROM products WHERE image IS NULL OR image = ""', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err.message);
        db.close();
        return;
    }
    
    console.log(`Found ${products.length} products without images`);
    
    if (products.length === 0) {
        console.log('All products already have images!');
        db.close();
        return;
    }
    
    let processed = 0;
    let errors = 0;
    
    products.forEach((product, index) => {
        const imageUrl = generateImageUrl(product.name, product.brand || 'laptop');
        
        db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(err) {
            if (err) {
                console.error(`❌ Error updating image for ${product.name}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Added image for: ${product.name}`);
                processed++;
            }
            
            // Check if all products are processed
            if (processed + errors === products.length) {
                console.log(`\\n🎉 Image processing complete!`);
                console.log(`✅ Successfully updated: ${processed} laptops`);
                console.log(`❌ Errors: ${errors} laptops`);
                console.log('\\nNote: These are placeholder images. For production, replace with actual laptop images.');
                db.close();
            }
        });
    });
});