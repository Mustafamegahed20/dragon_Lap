const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const jsonPath = path.join(__dirname, 'laptops_data.json');

console.log('Adding laptops from Excel data to database...');

// Read the JSON data
const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// Skip the header row and process the data
const laptopData = rawData.slice(1).filter(row => {
    // Filter out empty rows and ensure we have essential data
    return row.__EMPTY && row.__EMPTY_1 && row.__EMPTY_7;
});

console.log(`Found ${laptopData.length} laptops to process`);

// Connect to database
const db = new sqlite3.Database(dbPath);

// Function to generate laptop name and description
function generateLaptopInfo(brand, model, cpu, ram, storage, vga, screen) {
    const name = `${brand} ${model}`.trim();
    const description = `${brand} ${model} with ${cpu} processor, ${ram}GB RAM, ${storage}GB storage, ${vga} graphics, and ${screen}" display. Professional laptop with excellent performance.`;
    return { name, description };
}

// Function to convert specifications to proper format
function formatSpecs(cpu, ram, storage, vga, screen) {
    return {
        cpu: cpu || 'Not specified',
        ram: ram ? `${ram}GB DDR4` : 'Not specified',
        storage: storage ? `${storage}GB SSD` : 'Not specified',
        graphics: vga || 'Integrated Graphics',
        screen_size: screen ? `${screen}" Display` : 'Not specified',
        operating_system: 'Windows 11 Pro',
        weight: '2.0kg',
        battery: '50Wh Li-ion'
    };
}

// Function to get or create category
function getOrCreateCategory(brand, callback) {
    db.get('SELECT id FROM categories WHERE name = ?', [brand], (err, row) => {
        if (err) {
            callback(err, null);
            return;
        }
        
        if (row) {
            callback(null, row.id);
        } else {
            // Create new category
            db.run('INSERT INTO categories (name, description) VALUES (?, ?)', 
                [brand, `${brand} laptops with premium quality and performance`], 
                function(err) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, this.lastID);
                    }
                }
            );
        }
    });
}

// Process laptops
let processed = 0;
let errors = 0;

function processLaptop(index) {
    if (index >= laptopData.length) {
        console.log(`\\n🎉 Processing complete!`);
        console.log(`✅ Successfully added: ${processed} laptops`);
        console.log(`❌ Errors: ${errors} laptops`);
        db.close();
        return;
    }
    
    const laptop = laptopData[index];
    const brand = laptop.__EMPTY?.toString().trim();
    const model = laptop.__EMPTY_1?.toString().trim();
    const cpu = laptop['DELL 17 INCH ']?.toString().trim();
    const ram = laptop.__EMPTY_2;
    const storage = laptop.__EMPTY_3;
    const vga = laptop.__EMPTY_4?.toString().trim();
    const screen = laptop.__EMPTY_5;
    const qty = laptop.__EMPTY_6 || 1;
    const originalPrice = parseFloat(laptop.__EMPTY_7) || 0;
    
    // Increase price by 15%
    const finalPrice = Math.round(originalPrice * 1.15);
    
    console.log(`Processing: ${brand} ${model} - Original: ${originalPrice} EGP -> New: ${finalPrice} EGP`);
    
    if (!brand || !model || originalPrice <= 0) {
        console.log(`⚠️  Skipping invalid data for row ${index + 1}`);
        errors++;
        processLaptop(index + 1);
        return;
    }
    
    const { name, description } = generateLaptopInfo(brand, model, cpu, ram, storage, vga, screen);
    const specs = formatSpecs(cpu, ram, storage, vga, screen);
    
    // Get or create category
    getOrCreateCategory(brand, (err, categoryId) => {
        if (err) {
            console.error(`Error with category for ${brand}:`, err.message);
            errors++;
            processLaptop(index + 1);
            return;
        }
        
        // Insert laptop
        const insertSQL = `
            INSERT INTO products (
                name, description, price, category_id, stock, brand,
                cpu, ram, storage, graphics, screen_size, operating_system, weight, battery
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        const values = [
            name,
            description,
            finalPrice,
            categoryId,
            qty,
            brand,
            specs.cpu,
            specs.ram,
            specs.storage,
            specs.graphics,
            specs.screen_size,
            specs.operating_system,
            specs.weight,
            specs.battery
        ];
        
        db.run(insertSQL, values, function(err) {
            if (err) {
                console.error(`❌ Error inserting ${name}:`, err.message);
                errors++;
            } else {
                console.log(`✅ Added: ${name} (ID: ${this.lastID})`);
                processed++;
            }
            
            // Process next laptop
            processLaptop(index + 1);
        });
    });
}

// Clear existing products first (optional - comment out if you want to keep existing)
console.log('Clearing existing products...');
db.run('DELETE FROM products', (err) => {
    if (err) {
        console.error('Error clearing products:', err.message);
    } else {
        console.log('Existing products cleared. Starting import...');
    }
    
    // Start processing laptops
    processLaptop(0);
});