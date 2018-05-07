module SnapShotTest exposing (describe, it, snapshotUpdate, snapshotUpdateTuple)

{-| Test your Elm update function with Snapshot Testing

@docs it
@docs describe
@docs snapshotUpdate
@docs snapshotUpdateTuple

-}


type alias Test msg a =
    { msg : msg, newModel : a, title : String }


{-| Group and describe a list of test
-}
describe : String -> b -> ( String, b )
describe title testCases =
    ( title, testCases )


{-| Define a test with a message
-}
it : String -> msg -> ( String, msg )
it title action =
    ( title, action )


{-| Creates a record that can be serialized and snapshoted with Jest.
-}
snapshotUpdate : model -> (msg -> model -> model) -> List ( String, msg ) -> List (Test msg model)
snapshotUpdate model updateCallback testCases =
    testCases
        |> List.indexedMap (\index ( title, action ) -> ( (index |> toString) ++ " | " ++ title, action ))
        |> List.foldl
            (\( title, action ) acc ->
                case List.head acc of
                    Just last ->
                        let
                            { newModel } =
                                last

                            updatedModel =
                                updateCallback action newModel
                        in
                        acc
                            |> List.append [ { title = title, msg = action, newModel = updatedModel } ]

                    Nothing ->
                        let
                            newModel =
                                updateCallback action model
                        in
                        acc
                            |> List.append [ { title = title, msg = action, newModel = newModel } ]
            )
            []


{-| Same as @snapshotUpdate but The update function must be a Tuple
-}
snapshotUpdateTuple : model -> (msg -> model -> ( model, cmd )) -> List ( String, msg ) -> List (Test msg model)
snapshotUpdateTuple model updateCallback testCases =
    testCases
        |> List.indexedMap (\index ( title, action ) -> ( (index |> toString) ++ " | " ++ title, action ))
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
