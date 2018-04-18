const getElmApp = (testModule) => `
port module PrivateMain exposing (..)

import ${testModule} exposing (tests)
import Json.Encode exposing (encode, list, object, string)
import Platform
import WithRemoteData exposing (Msg(..), model, update)


port outGoing : String -> Cmd msg



---- THE LIB ----


describe : a -> b -> ( a, b )
describe title testCases =
  ( title, testCases )


it : String -> Msg -> ( String, Msg )
it title action =
  ( title, action )


runTests model updateCallback testCases =
  testCases
      |> List.map
          (\\( title, action ) ->
              let
                  newModel =
                      updateCallback action model |> Tuple.first
              in
              { title = title, msg = action, newModel = newModel }
          )



---- /THE LIB ----
---- THE TEST ----


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

module.exports = {getElmApp}
