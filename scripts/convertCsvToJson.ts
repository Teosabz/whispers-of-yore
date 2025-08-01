import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// Load CSV file
const csvPath = path.join(
  __dirname,
  "../data/07291c08-2bc1-484e-83d3-ef88fcaed292.csv"
);
const csvContent = fs.readFileSync(csvPath, "utf-8");

// Parse CSV to JSON
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

// Save as JSON
const jsonPath = path.join(__dirname, "../data/folktales.json");
fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2));

console.log("✅ CSV converted to folktales.json");
