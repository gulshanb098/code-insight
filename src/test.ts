import { generateReport } from "./index.js";

// Specify the directory you want to analyze
const directory = "src/";

// Call the function and log the result
const report = generateReport(directory);
console.log(report);