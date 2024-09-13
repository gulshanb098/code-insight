import { readdirSync, readFileSync, statSync } from "fs";
import { extname, join } from "path";

const calculateComplexity = (content: string) => {
  let count = 0;
  const controlFlowKeywords = ["if", "while", "for", "switch", "catch"];
  controlFlowKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    count += (content.match(regex) || []).length;
  });

  return count;
};

const trackErrorDensity = (content: string) => {
  const todoCount = (content.match(/TODO/g) || []).length;
  const errorCount = (content.match(/throw/g) || []).length;
  return todoCount + errorCount;
};

const checkCodeDebtRatio = (content: string) => {
  const lineCount = content.split("\n").length;
  return lineCount > 200 ? 1 : 0;
};

const processContent = (content: string) => {
  const complexity = calculateComplexity(content);
  const errorDensity = trackErrorDensity(content);
  const debtScore = checkCodeDebtRatio(content);

  return {
    complexity,
    errorDensity,
    debtScore,
  };
};

export const processFiles = (directoryPath: string) => {
  const result: any = {
    complexity: 0,
    errorDensity: 0,
    debtScore: 0,
  };

  // Helper function to process a single file
  const processFile = (filePath: string) => {
    const content = readFileSync(filePath, "utf-8");
    const processed = processContent(content);

    result.complexity += processed.complexity || 0;
    result.errorDensity += processed.errorDensity || 0;
    result.debtScore += processed.debtScore || 0;
  };

  // Function to recursively process directories
  const processDirectory = (dir: string) => {
    const files = readdirSync(dir);

    files.forEach((file) => {
      const filePath = join(dir, file);
      const stats = statSync(filePath);

      if (stats.isDirectory()) {
        // Recursively process subdirectory
        processDirectory(filePath);
      } else if (extname(file) === ".js" || extname(file) === ".ts") {
        // Process the file if it's a .js or .ts file
        processFile(filePath);
      }
    });
  };

  // Start processing from the root directory
  processDirectory(directoryPath);

  return result;
};
