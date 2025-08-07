const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Adding specification columns to products table...');

db.serialize(() => {
  // Add specification columns to existing products table
  const columns = [
    'cpu TEXT',
    'ram TEXT', 
    'storage TEXT',
    'graphics TEXT',
    'screen_size TEXT',
    'operating_system TEXT',
    'weight TEXT',
    'battery TEXT'
  ];

  columns.forEach(column => {
    db.run(`ALTER TABLE products ADD COLUMN ${column}`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error(`Error adding column ${column}:`, err.message);
      } else {
        console.log(`✓ Added column: ${column}`);
      }
    });
  });

  console.log('Specification columns added successfully!');
  db.close();
});