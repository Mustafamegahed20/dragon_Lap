const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Adding missing columns to database...');

db.serialize(() => {
    // Add missing columns to products table
    db.run('ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 1', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding stock column:', err.message);
        } else {
            console.log('✅ Added stock column to products table');
        }
    });

    db.run('ALTER TABLE products ADD COLUMN brand TEXT', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding brand column:', err.message);
        } else {
            console.log('✅ Added brand column to products table');
        }
    });

    // Add missing column to categories table
    db.run('ALTER TABLE categories ADD COLUMN description TEXT', (err) => {
        if (err && !err.message.includes('duplicate column name')) {
            console.error('Error adding description column:', err.message);
        } else {
            console.log('✅ Added description column to categories table');
        }
        
        console.log('\n✅ All missing columns added successfully!');
        db.close();
    });
});