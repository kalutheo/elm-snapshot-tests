// elm-snapshots-environment
const NodeEnvironment = require("jest-environment-node");
const Elm = require("./.elm-snapshots/PrivateMain.js");
const app = Elm.PrivateMain.worker();
const chalk = require("chalk");
const log = console.log;

async function getSnapshots() {
  return new Promise(resolve => {
    app.ports.outGoing.subscribe(payload => {
      resolve(payload);
    });
  });
}

class ElmSnapshotsEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
    log(chalk.rgb(255, 255, 255).bgBlue("Elm Snapshot starts..."));
  }

  async setup() {
    await super.setup();
    const snapshots = await getSnapshots();
    this.global.snapshots = JSON.parse(snapshots);
  }

  async teardown() {
    this.global.snapshots = null;
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = ElmSnapshotsEnvironment;
