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
  object [ ( "test", string testSuiteTitle ), ( "actions", list tests ) ] |> encode 4


main =
  Platform.program
      { init = ( (), outGoing (tests |> makeSnapshot) )
      , update = \\() -> \\() -> ( (), Cmd.none )
      , subscriptions = \\() -> Sub.none
      }
`;

module.exports = { getElmApp };
