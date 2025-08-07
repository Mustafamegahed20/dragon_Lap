const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Creating image mapping system for laptop models...');

// Get all unique laptop models
db.all('SELECT DISTINCT name, brand FROM products ORDER BY brand, name', (err, products) => {
    if (err) {
        console.error('Error fetching products:', err.message);
        db.close();
        return;
    }
    
    console.log(`Found ${products.length} unique laptop models:`);
    console.log('=====================================');
    
    // Create image mapping guide
    let imageGuide = `# Laptop Image Mapping Guide\n\n`;
    imageGuide += `## Instructions:\n`;
    imageGuide += `1. Create folder: /frontend/public/images/laptops/\n`;
    imageGuide += `2. Download images for each model below\n`;
    imageGuide += `3. Name images exactly as shown in "Image Filename"\n`;
    imageGuide += `4. Run update-laptop-images.js to update database\n\n`;
    imageGuide += `## Image Requirements:\n`;
    imageGuide += `- Format: JPG or PNG\n`;
    imageGuide += `- Size: 400x300px or similar ratio\n`;
    imageGuide += `- Background: White or transparent\n`;
    imageGuide += `- High quality product photos\n\n`;
    
    // Group by brand
    const brands = {};
    products.forEach(product => {
        if (!brands[product.brand]) brands[product.brand] = [];
        brands[product.brand].push(product.name);
    });
    
    Object.keys(brands).sort().forEach(brand => {
        imageGuide += `## ${brand} Laptops:\n\n`;
        brands[brand].forEach(modelName => {
            const filename = modelName.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .replace(/\s+/g, '-') + '.jpg';
            
            imageGuide += `### ${modelName}\n`;
            imageGuide += `- **Image Filename**: \`${filename}\`\n`;
            imageGuide += `- **Search Terms**: "${modelName} laptop official image"\n`;
            imageGuide += `- **Suggested Sources**: Official ${brand} website, manufacturer specs\n\n`;
            
            console.log(`${brand}: ${modelName} -> ${filename}`);
        });
        imageGuide += `---\n\n`;
    });
    
    // Save the guide
    const guidePath = path.join(__dirname, 'LAPTOP_IMAGE_GUIDE.md');
    fs.writeFileSync(guidePath, imageGuide);
    
    console.log('=====================================');
    console.log(`✅ Image guide created: ${guidePath}`);
    console.log(`\n📁 Next steps:`);
    console.log(`1. Create folder: frontend/public/images/laptops/`);
    console.log(`2. Follow the guide to download images`);
    console.log(`3. Run: node update-laptop-images.js`);
    
    db.close();
});