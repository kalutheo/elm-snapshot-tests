const getJestConfig = () => `
module.exports = {
  testEnvironment: './ElmSnapshotsEnvironment.js'
}
`;
const getJestEnvironment = () => `
const NodeEnvironment = require("jest-environment-node");
const Elm = require("./PrivateMain.js");
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

`;

const getTestRunner = () => `
const chalk = require("chalk");
const Elm = require("./PrivateMain.js");
const log = console.log;

snapshots.forEach(snapshotEntry => {
  console.log("snapshotEntry", snapshotEntry);
  describe(snapshotEntry.test, () => {
    snapshotEntry.actions.forEach(snapshot => {
      test(snapshot.title, () => {
        expect(snapshot).toMatchSnapshot();
      });
    });
  });
});
`;
const getElmApp = testModule => `
port module PrivateMain exposing (..)

import ${testModule} exposing (tests)
import Json.Encode exposing (encode, list, object, string)
import Platform


port outGoing : String -> Cmd msg


makeSnapshot ( testSuiteTitle, testsResults ) =
    let
        tests =
            testsResults
                |> List.map
                    (\\{ title, msg, newModel } ->
                        object
                            [ ( "title", string title )
                            , ( "msg", string (msg |> toString) )
                            , ( "newModel", string (newModel |> toString) )
                            ]
                    )
    in
    object [ ( "test", string testSuiteTitle ), ( "actions", list tests ) ]


makeSnapShotList tests =
    list (tests |> List.map makeSnapshot)


main =
    Platform.program
        { init = ( (), outGoing (tests |> makeSnapShotList |> encode 4) )
        , update = \\() -> \\() -> ( (), Cmd.none )
        , subscriptions = \\() -> Sub.none
        }
`;

module.exports = {
  getElmApp,
  getTestRunner,
  getJestConfig,
  getJestEnvironment
};
