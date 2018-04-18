#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const dir = ".elm-snapshots";
const rootPath = path.join(process.cwd(), ".");
const dirPath = path.join(process.cwd(), dir);
const {
  getElmApp,
  getTestRunner,
  getJestConfig,
  getJestEnvironment
} = require("./template.js");
const shell = require("shelljs");
const compile = require("node-elm-compiler").compile;
const yargs = require("yargs");
const chalk = require("chalk");
const log = console.log;
var argv = yargs
  .usage("Usage: <command> [options]")
  .version()
  .help("h")
  .alias("h", "help")
  .alias("n", "name")
  .describe("n", "Provide an Elm Module Name")
  .alias("u", "update")
  .describe("u", "Update Snapshot").argv;

// make our cache dir
try {
  fs.mkdirSync(dir);
} catch (e) {
  // ignore this and try to continue anyway
}

// Make Private file-
const privateMainPath = path.join(dirPath, "PrivateMain.elm");

fs.writeFileSync(privateMainPath, getElmApp(argv.name));

if (!argv.name) {
  log(chalk.rgb(255, 255, 255).bgRed("Please provide a valid Elm module name"));
  return;
}
// Compile elm
const privateMainCompiledPath = path.join(dirPath, "PrivateMain.js");
const options = {
  yes: true,
  output: privateMainCompiledPath
};
const compileProcess = compile(privateMainPath, options);

compileProcess.on("exit", function(exitCode) {
  if (exitCode !== 0) {
    log(
      chalk
        .rgb(255, 255, 255)
        .bgRed("Could not Run Tests : Exited with the code", exitCode)
    );
  } else {
    fs.writeFileSync(`${dirPath}/elm-snapshots.config.js`, getJestConfig());
    fs.writeFileSync(
      `${dirPath}/ElmSnapshotsEnvironment.js`,
      getJestEnvironment()
    );
    fs.writeFileSync(`${dirPath}/runner.test.js`, getTestRunner());
    // Run JEST
    shell.exec(
      `./node_modules/.bin/jest --colors --config ${dirPath}/elm-snapshots.config.js ${
        argv.update ? "-u" : ""
      }`
    );
    shell.exec(`cp -rvf ${dirPath}/__snapshots__ ${rootPath}/__snapshots__ `);
  }
});
