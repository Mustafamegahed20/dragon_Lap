const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Checking database schema...');

// Check products table schema
db.all("PRAGMA table_info(products)", (err, rows) => {
    if (err) {
        console.error('Error checking products table:', err.message);
        return;
    }
    
    console.log('\nProducts table columns:');
    rows.forEach(row => {
        console.log(`- ${row.name} (${row.type})`);
    });
});

// Check categories table schema
db.all("PRAGMA table_info(categories)", (err, rows) => {
    if (err) {
        console.error('Error checking categories table:', err.message);
        return;
    }
    
    console.log('\nCategories table columns:');
    rows.forEach(row => {
        console.log(`- ${row.name} (${row.type})`);
    });
    
    db.close();
});