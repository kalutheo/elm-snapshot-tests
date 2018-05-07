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
  describe(snapshotEntry.test, () => {
    snapshotEntry.actions.sort().forEach(snapshot => {
      test(snapshot.title, () => {
        expect({msg: snapshot.msg, newModel: snapshot.newModel }).toMatchSnapshot();
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

const getSampleTestApp = () => `
-- Read more about this program in the official Elm guide:
-- https://guide.elm-lang.org/architecture/user_input/buttons.html


module ExampleCounterTest exposing (..)

import Html exposing (beginnerProgram, button, div, text)
import Html.Events exposing (onClick)
import SnapShotTest exposing (..)


main =
    beginnerProgram { model = model, view = view, update = update }



-- MODEL


model =
    0



-- UPDATE


type Msg
    = Increment
    | Decrement


update msg model =
    case msg of
        Increment ->
            model + 1

        Decrement ->
            model - 1



-- VIEW


view model =
    div []
        [ button [ onClick Decrement ] [ text "-" ]
        , div [] [ text (toString model) ]
        , button [ onClick Increment ] [ text "+" ]
        ]



-- TESTS


tests =
    [ describe "Counter"
        ([ it "Should increment the counter" Increment
         , it "Should increment the counter" Increment
         , it "Should decrement the counter" Decrement
         ]
            |> snapshotUpdate model update
        )
    ]

`;

module.exports = {
  getElmApp,
  getTestRunner,
  getJestConfig,
  getJestEnvironment,
  getSampleTestApp
};
