const fs = require('fs');
const path = require('path');

// Read the recovered laptops data
const rawData = JSON.parse(fs.readFileSync('recovered_laptops_data.json', 'utf8'));

// Skip the header row and convert data
const products = [];
const categories = {};
let productId = 1;
let categoryId = 1;

// Process each laptop (skip first row as it's header)
for (let i = 1; i < rawData.length; i++) {
  const item = rawData[i];
  
  // Skip empty rows
  if (!item.__EMPTY || !item.__EMPTY_1) continue;
  
  const brand = item.__EMPTY?.toString().trim().toUpperCase();
  const model = item.__EMPTY_1?.toString().trim();
  const cpu = item["DELL 17 INCH "]?.toString().trim() || '';
  const ram = item.__EMPTY_2 ? `${item.__EMPTY_2}GB` : '';
  const storage = item.__EMPTY_3 ? `${item.__EMPTY_3}GB SSD` : '';
  const graphics = item.__EMPTY_4?.toString().trim() || '';
  const screen = item.__EMPTY_5 ? `${item.__EMPTY_5}" Display` : '';
  const price = item.__EMPTY_7 || 0;
  
  // Create categories if not exist
  if (!categories[brand]) {
    categories[brand] = {
      _id: categoryId.toString(),
      name: brand
    };
    categoryId++;
  }
  
  // Create product
  const product = {
    _id: productId.toString(),
    name: `${brand} ${model}`,
    description: `Professional ${brand.toLowerCase()} laptop with ${cpu} processor`,
    price: price,
    image: `/images/laptops/${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}.jpg`,
    category_id: {
      _id: categories[brand]._id,
      name: categories[brand].name
    },
    cpu: cpu,
    ram: ram,
    storage: storage,
    graphics: graphics,
    screen_size: screen,
    operating_system: 'Windows 11 Pro',
    weight: '2.5kg',
    battery: '65Wh'
  };
  
  products.push(product);
  productId++;
}

// Convert categories object to array
const categoriesArray = Object.values(categories);

// Output the results
console.log('Categories found:', categoriesArray.length);
console.log('Products created:', products.length);

categoriesArray.forEach(cat => {
  console.log(`- ${cat.name}`);
});

// Save the processed data
fs.writeFileSync('processed-categories.json', JSON.stringify(categoriesArray, null, 2));
fs.writeFileSync('processed-products.json', JSON.stringify(products, null, 2));

console.log('\nFiles created:');
console.log('- processed-categories.json');
console.log('- processed-products.json');

module.exports = { categories: categoriesArray, products };