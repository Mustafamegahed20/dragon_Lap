const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../db/dragonlap.sqlite');
const db = new sqlite3.Database(dbPath);

// Real specifications based on actual laptop models
const realSpecs = {
  'HP EliteBook 745 G2': {
    cpu: 'AMD A10 Pro-7350B (2.1GHz)',
    ram: '8GB DDR3L',
    storage: '256GB SSD',
    graphics: 'AMD Radeon R6',
    screen_size: '14" HD (1366x768)',
    operating_system: 'Windows 10 Pro',
    weight: '1.85kg',
    battery: '50Wh Li-ion'
  },
  'HP EliteBook MT42': {
    cpu: 'AMD A8 Pro-7150B (2.0GHz)',
    ram: '4GB DDR3L',
    storage: '500GB HDD',
    graphics: 'AMD Radeon R5',
    screen_size: '14" HD (1366x768)',
    operating_system: 'Windows 10 Pro',
    weight: '1.9kg',
    battery: '50Wh Li-ion'
  },
  'HP EliteBook 745 G3': {
    cpu: 'AMD A12 Pro-8800B (2.1GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    graphics: 'AMD Radeon R7',
    screen_size: '14" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '1.85kg',
    battery: '50Wh Li-ion'
  },
  'HP Pavilion 15': {
    cpu: 'Intel Core i5-8250U (1.6GHz)',
    ram: '8GB DDR4',
    storage: '1TB HDD + 128GB SSD',
    graphics: 'Intel UHD Graphics 620',
    screen_size: '15.6" Full HD (1920x1080)',
    operating_system: 'Windows 11 Home',
    weight: '2.1kg',
    battery: '41Wh Li-ion'
  },
  'HP ProBook 450 G5': {
    cpu: 'Intel Core i5-8250U (1.6GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    graphics: 'Intel UHD Graphics 620',
    screen_size: '15.6" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '2.1kg',
    battery: '48Wh Li-ion'
  },
  'HP EliteBook 840 G5': {
    cpu: 'Intel Core i7-8550U (1.8GHz)',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'Intel UHD Graphics 620',
    screen_size: '14" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '1.5kg',
    battery: '50Wh Li-ion'
  },
  'HP ZBook 15 G3': {
    cpu: 'Intel Core i7-6820HQ (2.7GHz)',
    ram: '32GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA Quadro M2000M 4GB',
    screen_size: '15.6" 4K UHD (3840x2160)',
    operating_system: 'Windows 10 Pro',
    weight: '2.6kg',
    battery: '90Wh Li-ion'
  },
  'Dell Latitude 6540': {
    cpu: 'Intel Core i5-4310M (2.7GHz)',
    ram: '8GB DDR3L',
    storage: '256GB SSD',
    graphics: 'Intel HD Graphics 4600',
    screen_size: '15.6" HD (1366x768)',
    operating_system: 'Windows 10 Pro',
    weight: '2.4kg',
    battery: '65Wh Li-ion'
  },
  'Dell Precision 7740': {
    cpu: 'Intel Core i9-9980HK (2.4GHz)',
    ram: '64GB DDR4',
    storage: '1TB NVMe SSD',
    graphics: 'NVIDIA Quadro RTX 5000 16GB',
    screen_size: '17.3" 4K UHD (3840x2160)',
    operating_system: 'Windows 10 Pro',
    weight: '3.2kg',
    battery: '97Wh Li-ion'
  },
  'Dell Precision 7730': {
    cpu: 'Intel Core i7-8850H (2.6GHz)',
    ram: '32GB DDR4',
    storage: '1TB NVMe SSD',
    graphics: 'NVIDIA Quadro P4200 8GB',
    screen_size: '17.3" 4K UHD (3840x2160)',
    operating_system: 'Windows 10 Pro',
    weight: '3.2kg',
    battery: '97Wh Li-ion'
  },
  'Dell Precision 7720': {
    cpu: 'Intel Core i7-7820HQ (2.9GHz)',
    ram: '32GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA Quadro P3000 6GB',
    screen_size: '17.3" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '3.2kg',
    battery: '97Wh Li-ion'
  },
  'Dell XPS 13': {
    cpu: 'Intel Core i7-1165G7 (2.8GHz)',
    ram: '16GB LPDDR4x',
    storage: '512GB NVMe SSD',
    graphics: 'Intel Iris Xe Graphics',
    screen_size: '13.4" 4K UHD+ (3840x2400)',
    operating_system: 'Windows 11 Home',
    weight: '1.2kg',
    battery: '52Wh Li-ion'
  },
  'Dell Inspiron 15 3000': {
    cpu: 'Intel Core i3-1115G4 (3.0GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    graphics: 'Intel UHD Graphics',
    screen_size: '15.6" HD (1366x768)',
    operating_system: 'Windows 11 Home',
    weight: '1.9kg',
    battery: '42Wh Li-ion'
  },
  'Dell Latitude 7420': {
    cpu: 'Intel Core i7-1165G7 (2.8GHz)',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'Intel Iris Xe Graphics',
    screen_size: '14" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '1.4kg',
    battery: '63Wh Li-ion'
  },
  'Lenovo ThinkPad X1 Carbon': {
    cpu: 'Intel Core i7-1165G7 (2.8GHz)',
    ram: '16GB LPDDR4x',
    storage: '1TB NVMe SSD',
    graphics: 'Intel Iris Xe Graphics',
    screen_size: '14" 2K (2560x1440)',
    operating_system: 'Windows 11 Pro',
    weight: '1.13kg',
    battery: '57Wh Li-ion'
  },
  'Lenovo ThinkPad T480': {
    cpu: 'Intel Core i5-8250U (1.6GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    graphics: 'Intel UHD Graphics 620',
    screen_size: '14" Full HD (1920x1080)',
    operating_system: 'Windows 10 Pro',
    weight: '1.7kg',
    battery: '48Wh + 24Wh Li-ion'
  },
  'Lenovo IdeaPad 3 15': {
    cpu: 'Intel Core i5-10210U (1.6GHz)',
    ram: '8GB DDR4',
    storage: '256GB SSD',
    graphics: 'Intel UHD Graphics',
    screen_size: '15.6" Full HD (1920x1080)',
    operating_system: 'Windows 11 Home',
    weight: '1.9kg',
    battery: '35Wh Li-ion'
  },
  'Lenovo Yoga 720': {
    cpu: 'Intel Core i7-7700HQ (2.8GHz)',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA GeForce GTX 1050 4GB',
    screen_size: '15.6" 4K UHD (3840x2160) Touch',
    operating_system: 'Windows 10 Home',
    weight: '2.2kg',
    battery: '72Wh Li-ion'
  },
  'Lenovo Legion Y540': {
    cpu: 'Intel Core i7-9750H (2.6GHz)',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA GeForce GTX 1660 Ti 6GB',
    screen_size: '15.6" Full HD (1920x1080) 144Hz',
    operating_system: 'Windows 10 Home',
    weight: '2.3kg',
    battery: '57Wh Li-ion'
  },
  'Acer Aspire 5': {
    cpu: 'Intel Core i5-1035G1 (1.0GHz)',
    ram: '8GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'Intel UHD Graphics',
    screen_size: '15.6" Full HD (1920x1080)',
    operating_system: 'Windows 11 Home',
    weight: '1.8kg',
    battery: '48Wh Li-ion'
  },
  'Acer Swift 3': {
    cpu: 'Intel Core i5-1135G7 (2.4GHz)',
    ram: '8GB LPDDR4x',
    storage: '512GB NVMe SSD',
    graphics: 'Intel Iris Xe Graphics',
    screen_size: '14" Full HD (1920x1080)',
    operating_system: 'Windows 11 Home',
    weight: '1.2kg',
    battery: '56Wh Li-ion'
  },
  'Acer Predator Helios 300': {
    cpu: 'Intel Core i7-10750H (2.6GHz)',
    ram: '16GB DDR4',
    storage: '512GB NVMe SSD',
    graphics: 'NVIDIA GeForce RTX 3060 6GB',
    screen_size: '15.6" Full HD (1920x1080) 144Hz',
    operating_system: 'Windows 11 Home',
    weight: '2.3kg',
    battery: '59Wh Li-ion'
  },
  'Acer Nitro 5': {
    cpu: 'Intel Core i5-10300H (2.5GHz)',
    ram: '8GB DDR4',
    storage: '256GB NVMe SSD',
    graphics: 'NVIDIA GeForce GTX 1650 4GB',
    screen_size: '15.6" Full HD (1920x1080)',
    operating_system: 'Windows 11 Home',
    weight: '2.3kg',
    battery: '57Wh Li-ion'
  }
};

console.log('Updating products with real specifications...');

db.serialize(() => {
  let remaining = Object.keys(realSpecs).length;
  
  if (remaining === 0) {
    console.log('No specifications to update');
    db.close();
    return;
  }

  Object.entries(realSpecs).forEach(([productName, specs]) => {
    db.run(
      `UPDATE products SET 
        cpu = ?,
        ram = ?,
        storage = ?,
        graphics = ?,
        screen_size = ?,
        operating_system = ?,
        weight = ?,
        battery = ?
      WHERE name = ?`,
      [
        specs.cpu,
        specs.ram,
        specs.storage,
        specs.graphics,
        specs.screen_size,
        specs.operating_system,
        specs.weight,
        specs.battery,
        productName
      ],
      function(err) {
        if (err) {
          console.error('Error updating product:', productName, err);
        } else if (this.changes > 0) {
          console.log(`✓ Updated specifications for: ${productName}`);
        } else {
          console.log(`! Product not found: ${productName}`);
        }
        
        remaining--;
        if (remaining === 0) {
          console.log('\n🎉 All product specifications updated successfully!');
          db.close();
        }
      }
    );
  });
});