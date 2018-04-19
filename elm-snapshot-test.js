#!/usr/bin/env node
const fs = require("fs-extra");
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
const argv = yargs
  .usage("Usage: <command> [options]")
  .version()
  .help("h")
  .alias("h", "help")
  .alias("n", "name")
  .describe("n", "Provide an Elm Module Name")
  .alias("u", "update")
  .describe("u", "Update Snapshot")
  .alias("ps", "preventSnapshotCopy")
  .describe("ps", "Prevent Snapshot Folder Copy").argv;

// make our cache dir
try {
  if (fs.pathExists(dir)) {
    fs.removeSync(dir);
  }
  fs.mkdirSync(dir);
} catch (e) {
  log(
    chalk
      .rgb(255, 255, 255)
      .bgRed("Could not create the test private folder", e)
  );
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
    fs.writeFileSync(`${dirPath}/${argv.name}.test.js`, getTestRunner());
    // Run JEST
    shell.exec(
      `./node_modules/.bin/jest --colors --config ${dirPath}/elm-snapshots.config.js ${
        argv.update ? "-u" : ""
      }`
    );
    if (!argv.preventSnapshotCopy) {
      fs.copySync(`${dirPath}/__snapshots__`, `${rootPath}/__snapshots__`);
    }
  }
});
