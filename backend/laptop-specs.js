// Laptop specifications generator based on model names
function generateLaptopSpecs(name, price) {
  const upperName = name.toUpperCase();
  
  // Base specifications object
  const specs = {
    cpu: '',
    ram: '',
    storage: '',
    graphics: '',
    screen_size: '',
    operating_system: 'Windows 11 Pro',
    weight: '',
    battery: ''
  };

  // CPU determination based on name and price
  if (upperName.includes('ELITEBOOK') || upperName.includes('PRECISION') || upperName.includes('THINKPAD')) {
    if (price > 20000) {
      specs.cpu = 'Intel Core i7-12th Gen';
    } else if (price > 15000) {
      specs.cpu = 'Intel Core i7-10th Gen';
    } else if (price > 10000) {
      specs.cpu = 'Intel Core i5-10th Gen';
    } else {
      specs.cpu = 'Intel Core i5-8th Gen';
    }
  } else if (upperName.includes('745') || upperName.includes('MT42')) {
    specs.cpu = 'AMD A10 Pro-7350B';
  } else if (upperName.includes('LATITUDE')) {
    if (price > 15000) {
      specs.cpu = 'Intel Core i7-10th Gen';
    } else {
      specs.cpu = 'Intel Core i5-8th Gen';
    }
  } else if (upperName.includes('INSPIRON')) {
    specs.cpu = 'Intel Core i5-11th Gen';
  } else if (upperName.includes('IDEAPAD') || upperName.includes('YOGA')) {
    specs.cpu = 'Intel Core i5-11th Gen';
  } else {
    // Default CPU based on price
    if (price > 20000) {
      specs.cpu = 'Intel Core i7-11th Gen';
    } else if (price > 10000) {
      specs.cpu = 'Intel Core i5-10th Gen';
    } else {
      specs.cpu = 'Intel Core i3-8th Gen';
    }
  }

  // RAM determination based on price and model
  if (price > 25000) {
    specs.ram = '32GB DDR4';
  } else if (price > 20000) {
    specs.ram = '16GB DDR4';
  } else if (price > 15000) {
    specs.ram = '16GB DDR4';
  } else if (price > 10000) {
    specs.ram = '8GB DDR4';
  } else if (price > 7000) {
    specs.ram = '8GB DDR3';
  } else {
    specs.ram = '4GB DDR3';
  }

  // Storage determination
  if (price > 20000) {
    specs.storage = '1TB NVMe SSD';
  } else if (price > 15000) {
    specs.storage = '512GB SSD';
  } else if (price > 10000) {
    specs.storage = '256GB SSD';
  } else {
    specs.storage = '256GB SSD';
  }

  // Graphics determination
  if (upperName.includes('PRECISION') || upperName.includes('ZBOOK')) {
    specs.graphics = 'NVIDIA Quadro RTX 3000';
  } else if (upperName.includes('GAMING') || price > 25000) {
    specs.graphics = 'NVIDIA GeForce RTX 3060';
  } else if (price > 15000) {
    specs.graphics = 'Intel Iris Xe Graphics';
  } else if (upperName.includes('745')) {
    specs.graphics = 'AMD Radeon R6';
  } else {
    specs.graphics = 'Intel UHD Graphics';
  }

  // Screen size determination
  if (upperName.includes('15') || upperName.includes('1550')) {
    specs.screen_size = '15.6" Full HD';
  } else if (upperName.includes('14') || upperName.includes('1450')) {
    specs.screen_size = '14" Full HD';
  } else if (upperName.includes('13') || upperName.includes('1350')) {
    specs.screen_size = '13.3" Full HD';
  } else if (upperName.includes('17') || upperName.includes('7740') || upperName.includes('7730')) {
    specs.screen_size = '17.3" 4K UHD';
  } else {
    specs.screen_size = '15.6" Full HD';
  }

  // Weight determination based on screen size
  if (specs.screen_size.includes('17')) {
    specs.weight = '2.8kg';
  } else if (specs.screen_size.includes('15')) {
    specs.weight = '2.2kg';
  } else if (specs.screen_size.includes('14')) {
    specs.weight = '1.8kg';
  } else {
    specs.weight = '1.6kg';
  }

  // Battery determination
  if (upperName.includes('PRECISION') || upperName.includes('ELITEBOOK')) {
    specs.battery = '72Wh Li-ion';
  } else if (specs.screen_size.includes('17')) {
    specs.battery = '97Wh Li-ion';
  } else {
    specs.battery = '56Wh Li-ion';
  }

  return specs;
}

module.exports = { generateLaptopSpecs };