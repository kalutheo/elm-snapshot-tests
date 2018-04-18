module SnapShotTest exposing (..)


describe : a -> b -> ( a, b )
describe title testCases =
    ( title, testCases )


it : String -> msg -> ( String, msg )
it title action =
    ( title, action )


runTests model updateCallback testCases =
    testCases
        |> List.foldl
            (\( title, action ) acc ->
                case List.head acc of
                    Just last ->
                        let
                            { newModel } =
                                last

                            updatedModel =
                                updateCallback action newModel |> Tuple.first
                        in
                        acc
                            |> List.append [ { title = title, msg = action, newModel = updatedModel } ]

                    Nothing ->
                        let
                            newModel =
                                updateCallback action model |> Tuple.first
                        in
                        acc
                            |> List.append [ { title = title, msg = action, newModel = newModel } ]
            )
            []



{--|> List.map
            (\( title, action ) ->
                let
                    newModel =
                        updateCallback action model |> Tuple.first
                in
                { title = title, msg = action, newModel = newModel }
            )
        |> Debug.log "yeahh" --}
