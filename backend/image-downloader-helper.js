const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// This script helps download images - you need to provide URLs
const imageUrls = {
    // Example entries - you need to add the actual URLs
    'dell-xps-13.jpg': 'https://example.com/dell-xps-13-image.jpg',
    'hp-pavilion-15.jpg': 'https://example.com/hp-pavilion-15-image.jpg',
    // Add more URLs here...
};

const downloadDir = path.join(__dirname, '../frontend/public/images/laptops');

// Ensure directory exists
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(downloadDir, filename);
        const file = fs.createWriteStream(filePath);
        
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, (response) => {
            if (response.statusCode === 200) {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve();
                });
            } else {
                console.log(`❌ Failed to download ${filename}: ${response.statusCode}`);
                reject(new Error(`HTTP ${response.statusCode}`));
            }
        }).on('error', (err) => {
            console.log(`❌ Error downloading ${filename}:`, err.message);
            reject(err);
        });
    });
}

async function downloadAllImages() {
    console.log('Starting image downloads...');
    
    for (const [filename, url] of Object.entries(imageUrls)) {
        try {
            await downloadImage(url, filename);
            // Add delay to be respectful to servers
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.log(`Failed to download ${filename}:`, error.message);
        }
    }
    
    console.log('Download process completed!');
}

// Instructions for user
console.log(`
📋 INSTRUCTIONS:
1. Find image URLs for each laptop model
2. Add them to the 'imageUrls' object in this file
3. Run: node image-downloader-helper.js
4. Then run: node update-laptop-images.js

🔍 How to find image URLs:
1. Go to manufacturer website
2. Find the laptop model page
3. Right-click on the product image
4. Select "Copy image address" or "Copy link address"
5. Add the URL to the imageUrls object

Example:
'dell-inspiron-3780.jpg': 'https://i.dell.com/is/image/DellContent/dell-inspiron-15-3000-laptop.jpg'
`);

// Run if URLs are provided
if (Object.keys(imageUrls).length > 2) { // More than just examples
    downloadAllImages();
} else {
    console.log('⚠️  No image URLs provided. Please add URLs to the imageUrls object first.');
}