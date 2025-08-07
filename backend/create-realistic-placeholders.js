const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Creating realistic laptop placeholder images...');

// Function to generate realistic laptop image URLs based on model and brand
function getRealisticImageUrl(name, brand) {
    const cleanBrand = (brand || 'laptop').toLowerCase().trim();
    const cleanName = name.toLowerCase().trim();
    
    // Use a service that provides computer/laptop stock photos
    // These are royalty-free laptop images from Unsplash
    const laptopImages = [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop&crop=center', // MacBook style
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop&crop=center', // Silver laptop
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop&crop=center', // Black laptop
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop&crop=center', // Modern laptop
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop&crop=center', // Business laptop
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&crop=center', // Gaming laptop
    ];
    
    // Assign different images based on model type
    let imageIndex = 0;
    
    if (cleanName.includes('xps') || cleanName.includes('elitebook')) {
        imageIndex = 0; // Premium models
    } else if (cleanName.includes('inspiron') || cleanName.includes('pavilion')) {
        imageIndex = 1; // Consumer models
    } else if (cleanName.includes('latitude') || cleanName.includes('probook')) {
        imageIndex = 2; // Business models
    } else if (cleanName.includes('precision') || cleanName.includes('zbook')) {
        imageIndex = 3; // Workstation models
    } else if (cleanName.includes('ideapad') || cleanName.includes('envy')) {
        imageIndex = 4; // Mainstream models
    } else {
        imageIndex = 5; // Others
    }
    
    return laptopImages[imageIndex];
}

// Update all products with realistic laptop images
db.all('SELECT id, name, brand FROM products', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err.message);
        db.close();
        return;
    }
    
    console.log(`Updating ${products.length} products with realistic laptop images...`);
    
    let processed = 0;
    let updated = 0;
    
    products.forEach(product => {
        const imageUrl = getRealisticImageUrl(product.name, product.brand);
        
        db.run('UPDATE products SET image = ? WHERE id = ?', [imageUrl, product.id], function(err) {
            if (err) {
                console.error(`❌ Error updating ${product.name}:`, err.message);
            } else {
                console.log(`✅ Updated: ${product.name} -> realistic laptop image`);
                updated++;
            }
            
            processed++;
            if (processed === products.length) {
                console.log(`\\n🎉 Update complete!`);
                console.log(`✅ Successfully updated: ${updated} products`);
                console.log(`🖼️  All products now have realistic laptop images from Unsplash`);
                console.log(`\\n📸 Image types assigned:`);
                console.log(`- Premium models (XPS, EliteBook): Modern silver laptop`);
                console.log(`- Consumer models (Inspiron, Pavilion): Standard laptop`);
                console.log(`- Business models (Latitude, ProBook): Professional laptop`);
                console.log(`- Workstation models (Precision, ZBook): High-end laptop`);
                console.log(`- Others: Various laptop styles`);
                db.close();
            }
        });
    });
});