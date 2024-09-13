import chalk from "chalk";
import figlet from "figlet";
const { textSync } = figlet;
import Table from "cli-table3";
import { processFiles } from "./insighter.js";

export const generateReport = (directoryPath: string) => {
  const report = processFiles(directoryPath);
  console.log(
    chalk.green(textSync("Code Insight", { horizontalLayout: "full" }))
  );

  const table = new Table({
    head: [
      chalk.cyan("Metric"),
      chalk.cyan("Value"),
      chalk.cyan("Description"),
    ],
    colWidths: [35, 15, 45],
  });

  table.push(
    [
      chalk.yellow("Control Flow Keywords"),
      chalk.green(report.complexity),
      "Measures complexity due to control flow keywords",
    ],
    // [
    //   chalk.yellow("Functional Programming Constructs"),
    //   chalk.green(report.controlFlow.functionalConstructs),
    //   "Measures complexity due to functional programming constructs",
    // ],
    // [
    //   chalk.yellow("Behavioral Constructs"),
    //   chalk.green(report.controlFlow.behavioralConstructs),
    //   "Measures complexity due to common behavioral constructs",
    // ],
    // [
    //   chalk.yellow("Functional Complexity"),
    //   chalk.green(report.functional),
    //   "Overall complexity due to functional programming constructs",
    // ],
    // [
    //   chalk.yellow("Behavioral Constructs Complexity"),
    //   chalk.green(report.behavioral),
    //   "Overall complexity due to common behavioral constructs",
    // ],
    [
      chalk.yellow("Error Density"),
      chalk.green(report.errorDensity),
      "Tracks error-prone areas",
    ],
    [
      chalk.yellow("Code Debt Ratio"),
      chalk.green(report.debtScore),
      "Estimates technical debt",
    ]
  );

  console.log(table.toString());

  const metrics = {
    "Control Flow Keywords": report.complexity,
    // "Functional Programming Constructs":
    //   report.controlFlow.functionalConstructs,
    // "Behavioral Constructs": report.controlFlow.behavioralConstructs,
    // "Functional Complexity": report.functional,
    // "Behavioral Constructs Complexity": report.behavioral,
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
