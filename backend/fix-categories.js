const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('Cleaning up duplicate categories...');

db.serialize(() => {
  // Clear all categories and products first
  db.run('DELETE FROM products');
  db.run('DELETE FROM categories');
  
  // Insert unique categories
  const categories = ['HP', 'DELL', 'LENOVO', 'ACER'];
  
  categories.forEach(category => {
    db.run('INSERT INTO categories (name) VALUES (?)', [category], function(err) {
      if (err) {
        console.error('Error inserting category:', err);
      } else {
        console.log(`Inserted category: ${category} with ID: ${this.lastID}`);
      }
    });
  });
  
  console.log('Categories cleaned up successfully!');
  db.close();
});