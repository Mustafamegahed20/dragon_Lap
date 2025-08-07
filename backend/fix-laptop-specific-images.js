const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');

console.log('Updating laptops with laptop-specific placeholder images...');

// Function to generate laptop-specific image URL
function generateLaptopImageUrl(name, brand) {
    const cleanBrand = (brand || 'laptop').toLowerCase().trim();
    const cleanName = name.toLowerCase().trim();
    
    // Use laptop-specific placeholder services or create laptop-themed placeholders
    if (cleanBrand.includes('dell')) {
        // Dell laptop placeholder - using a laptop icon service
        return `https://dummyimage.com/400x300/2563eb/ffffff&text=DELL+LAPTOP`;
    } else if (cleanBrand.includes('hp')) {
        // HP laptop placeholder
        return `https://dummyimage.com/400x300/dc2626/ffffff&text=HP+LAPTOP`;
    } else if (cleanBrand.includes('lenovo')) {
        // Lenovo laptop placeholder
        return `https://dummyimage.com/400x300/059669/ffffff&text=LENOVO+LAPTOP`;
    } else if (cleanBrand.includes('acer')) {
        // Acer laptop placeholder
        return `https://dummyimage.com/400x300/7c3aed/ffffff&text=ACER+LAPTOP`;
    } else {
        // Generic laptop placeholder
        return `https://dummyimage.com/400x300/6b7280/ffffff&text=LAPTOP`;
    }
}

const db = new sqlite3.Database(dbPath);

console.log('Fetching all products to update with laptop-specific images...');

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
        const imageUrl = generateLaptopImageUrl(product.name, product.brand);
        
        db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(err) {
            if (err) {
                console.error(`❌ Error updating image for ${product.name}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Updated laptop image for: ${product.name} -> ${product.brand} style`);
                processed++;
            }
            
            // Check if all products are processed
            if (processed + errors === products.length) {
                console.log(`\\n🎉 Laptop-specific image update complete!`);
                console.log(`✅ Successfully updated: ${processed} laptops`);
                console.log(`❌ Errors: ${errors} laptops`);
                console.log('\\n📱 All images now show laptop-themed placeholders with brand colors!');
                db.close();
            }
        });
    });
});