#!/usr/bin/env node
const fs = require('fs');
const path = require("path");
const dir = ".elm-snapshots";
const dirPath = path.join(process.cwd(), dir);
const {getElmApp} = require('./template.js');
const shell = require("shelljs");
const compile = require('node-elm-compiler').compile;
const yargs = require('yargs');
const chalk = require('chalk');
const log = console.log;
var argv = yargs
    .usage('Usage: <command> [options]')
    .version()
    .help('h')
    .alias('h', 'help')
    .alias('n', 'name')
    .describe('f', 'Provide an Elm Module Name')
    .argv;

// make our cache dir
try{
    fs.mkdirSync(dir);
} catch (e) {
    // ignore this and try to continue anyway
}

// Make Private file-
const privateMainPath = path.join(dirPath, 'PrivateMain.elm');

fs.writeFileSync(privateMainPath, getElmApp(argv.name));

if(!argv.name) {
  log(chalk.rgb(255,255,255).bgRed("Please provide a valid Elm module name"));
  return;
}
// Compile elm
const privateMainCompiledPath = path.join(dirPath, 'PrivateMain.js');
const options = {
    yes: true,
    output: privateMainCompiledPath
};
const compileProcess = compile(privateMainPath, options);

compileProcess.on('exit',
    function(exitCode){
        if (exitCode !== 0){
            log(chalk.rgb(255,255,255).bgRed("Could not Run Tests : Exited with the code", exitCode));
        } else {

          // Run JEST
          shell.exec(`./node_modules/.bin/jest --colors --config elm-snapshots.config.js`);
        }
});
