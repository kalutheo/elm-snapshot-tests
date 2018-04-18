module SnapShotTest exposing (..)


describe : a -> b -> ( a, b )
describe title testCases =
    ( title, testCases )


it : String -> msg -> ( String, msg )
it title action =
    ( title, action )


runTests :
    a
    -> (b -> a -> ( c, a2 ))
    -> List ( d, b )
    -> List { msg : b, newModel : c, title : d }
runTests model updateCallback testCases =
    testCases
        |> List.map
            (\( title, action ) ->
                let
                    newModel =
                        updateCallback action model |> Tuple.first
                in
                { title = title, msg = action, newModel = newModel }
            )
