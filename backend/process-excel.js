const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const excelPath = "C:\\Users\\MostafaMegahedTAQAHo\\Downloads\\10-11-2024 FAINAL.xlsx";

console.log(`Reading Excel file: ${excelPath}`);

try {
    // Check if file exists
    if (!fs.existsSync(excelPath)) {
        console.error("Excel file not found!");
        process.exit(1);
    }

    // Read the workbook
    const workbook = XLSX.readFile(excelPath);
    
    // Get sheet names
    console.log("Available sheets:", workbook.SheetNames);
    
    // Read the first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Total rows: ${data.length}`);
    console.log("Columns found:", Object.keys(data[0] || {}));
    console.log("\nFirst few rows:");
    console.log(data.slice(0, 3));
    
    // Save to JSON file for easier processing
    const jsonPath = path.join(__dirname, 'laptops_data.json');
    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
    console.log(`\nData saved to JSON: ${jsonPath}`);
    
} catch (error) {
    console.error("Error reading Excel file:", error.message);
}