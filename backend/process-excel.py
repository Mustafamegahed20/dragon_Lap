import pandas as pd
import sqlite3
import os
from pathlib import Path

# Read the Excel file
excel_path = r"C:\Users\MostafaMegahedTAQAHo\Downloads\10-11-2024 FAINAL.xlsx"
print(f"Reading Excel file: {excel_path}")

try:
    # Read all sheets to see what's available
    xl_file = pd.ExcelFile(excel_path)
    print(f"Available sheets: {xl_file.sheet_names}")
    
    # Read the first sheet (or specify sheet name if known)
    df = pd.read_excel(excel_path, sheet_name=0)
    
    print(f"Columns found: {list(df.columns)}")
    print(f"Total rows: {len(df)}")
    print("\nFirst few rows:")
    print(df.head())
    
    # Save to CSV for easier inspection
    csv_path = r"C:\Users\MostafaMegahedTAQAHo\OneDrive - TAQA Arabia\Mustafa\dragon lap\backend\laptops_data.csv"
    df.to_csv(csv_path, index=False)
    print(f"\nData saved to CSV: {csv_path}")
    
except Exception as e:
    print(f"Error reading Excel file: {e}")
    print("Please make sure the file exists and is accessible.")