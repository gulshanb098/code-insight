import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { extname, join } from "path";

// Control Flow Complexity Keywords
export const controlFlowKeywords = [
  "if",
  "else",
  "else if",
  "switch",
  "case",
  "default",
  "for",
  "do",
  "while",
  "break",
  "continue",
];

// Functional Complexity Keywords
export const functionalKeywords = [
  "map",
  "filter",
  "reduce",
  "forEach",
  "some",
  "every",
  "find",
  "findIndex",
  "includes",
];

// Behavioral Constructs Keywords
export const behavioralKeywords = ["return", "yield", "async", "await"];

/**
 * Calculates the complexity due to control flow keywords in the code.
 * @param content The content of the file to analyze.
 * @returns The count of occurrences of control flow keywords.
 */
const controlFlowComplexity = (content: string) => {
  let count = 0;
  controlFlowKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    count += (content.match(regex) || []).length;
  });

  return count;
};

/**
 * Calculates the complexity due to functional programming keywords in the code.
 * @param content The content of the file to analyze.
 * @returns The count of occurrences of functional programming keywords.
 */
const functionalComplexity = (content: string) => {
  let count = 0;
  functionalKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    count += (content.match(regex) || []).length;
  });

  return count;
};

/**
 * Calculates the complexity due to behavioral programming constructs in the code.
 * @param content The content of the file to analyze.
 * @returns The count of occurrences of behavioral constructs.
 */
const behavioralComplexity = (content: string) => {
  let count = 0;
  behavioralKeywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    count += (content.match(regex) || []).length;
  });

  return count;
};

/**
 * Counts the number of TODO comments in the code.
 * @param content The content of the file to analyze.
 * @returns The number of TODO comments.
 */
const getAllTODOs = (content: string) => {
  const todoCount = (content.match(/TODO/g) || []).length;
  return todoCount;
};

/**
 * Tracks error density by counting occurrences of specific error-handling constructs.
 * @param content The content of the file to analyze.
 * @returns The total count of error-handling constructs.
 */
const trackErrorDensity = (content: string) => {
  const errorHandlingCount = (content.match(/throw\s+new\s+/g) || []).length;
  const catchBlockCount = (content.match(/catch\s*\(/g) || []).length;
  return errorHandlingCount + catchBlockCount;
};

/**
 * Checks for code debt based on the number of lines in the code.
 * @param content The content of the file to analyze.
 * @returns 1 if the line count exceeds 200, otherwise 0.
 */
const checkCodeDebtRatio = (content: string) => {
  const lineCount = content.split("\n").length;
  return lineCount > 200 ? 1 : 0;
};

/**
 * Processes the content of a file to compute various code metrics.
 * @param content The content of the file to analyze.
 * @returns An object containing various computed metrics.
 */
const processContent = (content: string) => {
  const controlComplexity = controlFlowComplexity(content);
  const funcComplexity = functionalComplexity(content);
  const behaveComplexity = behavioralComplexity(content);
  const todoDensity = getAllTODOs(content);
  const errorDensity = trackErrorDensity(content);
  const debtScore = checkCodeDebtRatio(content);

  return {
    controlComplexity,
    funcComplexity,
    behaveComplexity,
    todoDensity,
    errorDensity,
    debtScore,
  };
};

/**
 * Processes all files in a directory and its subdirectories to compute various code metrics.
 * @param directoryPath The path to the directory containing the codebase.
 * @returns An object with aggregated metrics from all processed files.
 */
export const processFiles = (directoryPath: string) => {
  const result: any = {
    control: 0,
    func: 0,
    behave: 0,
    todo: 0,
    errorDensity: 0,
    debtScore: 0,
  };

  // Helper function to process a single file
  const processFile = (filePath: string) => {
    const content = readFileSync(filePath, "utf-8");
    const processed = processContent(content);

    result.control += processed.controlComplexity || 0;
    result.func += processed.funcComplexity || 0;
    result.behave += processed.behaveComplexity || 0;
    result.todo += processed.todoDensity || 0;
    result.errorDensity += processed.errorDensity || 0;
    result.debtScore += processed.debtScore || 0;
  };

  // Function to recursively process directories
  const processDirectory = (dir: string) => {
    if (!existsSync(dir)) {
      console.error(`Directory does not exist: ${dir}`);
      return;
    }

    try {
      // Read the contents of the directory
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
    } catch (dirError: unknown) {
      if (dirError instanceof Error) {
        console.error(`Error reading directory '${dir}':`, dirError.message);
      } else {
        console.error(`Unknown error reading directory '${dir}':`, dirError);
      }
      process.exit(1);
    }
  };

  // Start processing from the root directory
  processDirectory(directoryPath);

  return result;
};
