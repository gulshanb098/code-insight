import { generateReport } from "../index.js";

// Check if a directory path was provided
const directoryPath = process.argv[2];

if (!directoryPath) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

// Call generateReport with the provided directory path
generateReport(directoryPath);
