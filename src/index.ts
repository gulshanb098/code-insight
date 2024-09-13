import chalk from "chalk";
import Table from "cli-table3";
import figlet from "figlet";
import {
  behavioralKeywords,
  controlFlowKeywords,
  functionalKeywords,
  processFiles,
} from "./insighter.js";
const { textSync } = figlet;

/**
 * Wrap text to fit within a specified width.
 * @param text The text to wrap.
 * @param width The maximum width of each line.
 * @returns Wrapped text.
 */
const wrapText = (text: string, width: number) => {
  const lines = [];
  let currentLine = "";

  text.split(" ").forEach((word) => {
    if (currentLine.length + word.length + 2 > width) {
      lines.push(chalk.blueBright(currentLine.trim()));
      currentLine = word;
    } else {
      currentLine += (currentLine.length ? " " : "") + word;
    }
  });

  if (currentLine.length) {
    lines.push(chalk.blueBright(currentLine.trim()));
  }

  return lines.join("\n");
};

/**
 * Main Function to generate a health report
 * @param directoryPath Path to the codebase directory
 * @returns Report object with metrics
 */
export const generateReport = (directoryPath: string) => {
  const report = processFiles(directoryPath);
  console.log(
    chalk.green(textSync("Code Insight", { horizontalLayout: "full" }))
  );

  const table = new Table({
    head: [
      chalk.cyan("Metric"),
      chalk.cyan("Keywords"),
      chalk.cyan("Value"),
      chalk.cyan("Description"),
    ],
    colWidths: [35, 50, 15, 65],
  });

  table.push(
    [
      chalk.yellow("Control Flow Keywords"),
      wrapText(controlFlowKeywords.join(", "), 50),
      chalk.green(report.control),
      "Measures complexity due to control flow keywords",
    ],
    [
      chalk.yellow("Functional Programming Constructs"),
      wrapText(functionalKeywords.join(", "), 50),
      chalk.green(report.func),
      "Measures complexity due to functional programming constructs",
    ],
    [
      chalk.yellow("Behavioral Constructs"),
      wrapText(behavioralKeywords.join(", "), 50),
      chalk.green(report.behave),
      "Measures complexity due to common behavioral constructs",
    ],
    [
      chalk.yellow("TODO Count"),
      chalk.blueBright("TODO"),
      chalk.green(report.todo),
      "Tracks the number of TODO comments in the codebase",
    ],
    [
      chalk.yellow("Error Density"),
      chalk.blueBright("throw new error, catch"),
      chalk.green(report.errorDensity),
      "Tracks error-prone areas",
    ],
    [
      chalk.yellow("Large File Indicator"),
      null,
      chalk.green(report.debtScore),
      "Identifies files with excessive lines, may require refactoring",
    ]
  );

  console.log(table.toString());

  const metrics = {
    "Control Flow Keywords": report.control,
    "Functional Programming Constructs": report.func,
    "Behavioral Constructs": report.behave,
    "TODO Count": report.todo,
    "Error Density": report.errorDensity,
    "Code Debt Ratio": report.debtScore,
  };

  const highestPriorityMetric = Object.entries(metrics).reduce(
    (max, [key, value]) => (value > max.value ? { name: key, value } : max),
    { name: "None", value: 0 }
  );

  console.log(
    chalk.magenta.bold("\nNote: ") +
      `The highest complexity metric is '${highestPriorityMetric.name}'. ` +
      `Consider refactoring the areas related to this metric as it has the highest value.\n`
  );
};
