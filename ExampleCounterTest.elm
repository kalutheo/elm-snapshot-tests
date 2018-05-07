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
