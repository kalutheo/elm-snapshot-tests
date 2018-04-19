module SnapShotTest exposing (..)


type alias Test msg a =
    { msg : msg, newModel : a, title : String }


describe : String -> b -> ( String, b )
describe title testCases =
    ( title, testCases )


it : String -> msg -> ( String, msg )
it title action =
    ( title, action )


snapshotUpdate : model -> (msg -> model -> ( model, cmd )) -> List ( String, msg ) -> List (Test msg model)
snapshotUpdate model updateCallback testCases =
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
