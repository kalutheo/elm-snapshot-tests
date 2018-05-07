module ExampleBmiCalculatorTest exposing (..)

import Html exposing (..)
import Html.Attributes exposing (checked, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
import Round
import SnapShotTest exposing (..)


main : Program Never Model Msg
main =
    Html.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { height : String
    , weight : String
    , gender : Gender
    }


initialModel : Model
initialModel =
    { height = "180"
    , weight = "80"
    , gender = Female
    }


type alias Height =
    Float


type alias Weight =
    Float


type Gender
    = Male
    | Female


type Msg
    = SelectHeight String
    | SelectWeight String
    | SelectGender Gender


computeBmi : Weight -> Height -> Float
computeBmi weight height =
    let
        heightInMeters =
            height / 100
    in
    weight / (heightInMeters * heightInMeters)



-- Lens Setters


setWeight : String -> Model -> Model
setWeight value model =
    { model | weight = value }


setGender : Gender -> Model -> Model
setGender value model =
    { model | gender = value }


setHeight : String -> Model -> Model
setHeight value model =
    { model | height = value }



--


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SelectHeight height ->
            (model |> setHeight height) ! []

        SelectWeight weight ->
            (model |> setWeight weight) ! []

        SelectGender gender ->
            (model |> setGender gender) ! []


viewInput : String -> String -> (String -> Msg) -> Html Msg
viewInput title val handleInput =
    div []
        [ label [] [ text title ]
        , input [ type_ "text", onInput handleInput, value val ] []
        ]


viewGenderRadio : String -> Gender -> Bool -> Html Msg
viewGenderRadio title val isChecked =
    let
        inputId =
            val |> toString
    in
    div []
        [ label [ for inputId ] [ text title ]
        , input [ id inputId, type_ "radio", name "gender", checked isChecked, onClick (SelectGender val) ] []
        ]


viewGenderSelector : Gender -> Html Msg
viewGenderSelector selectedGender =
    div []
        [ label [] [ text "Vous êtes ? " ]
        , viewGenderRadio "Une Femme" Female (selectedGender == Female)
        , viewGenderRadio "Un Homme" Male (selectedGender == Male)
        ]


viewBmiText : String -> String -> Html msg
viewBmiText weight height =
    Result.map2 computeBmi (String.toFloat weight) (String.toFloat height)
        |> Result.map (\bmi -> span [] [ text (bmi |> Round.ceiling 2) ])
        |> Result.withDefault (text "Veuillez renseigner une taille et un poids valides")


view : Model -> Html Msg
view model =
    div []
        [ viewGenderSelector model.gender
        , viewInput "Taille" model.height SelectHeight
        , viewInput "Poids" model.weight SelectWeight
        , viewBmiText model.weight model.height
        ]


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


init : ( Model, Cmd Msg )
init =
    ( initialModel, Cmd.none )



-- TESTS


tests =
    [ describe "A small person BMI"
        ([ it "Select a Gender" (SelectGender Female)
         , it "Select a Height" (SelectHeight "150")
         , it "Select a Weight" (SelectWeight "55")
         ]
            |> snapshotUpdateTuple initialModel update
        )
    , describe "A tall and slim person BMI"
        ([ it "Select a Gender" (SelectGender Male)
         , it "Select a Height" (SelectHeight "190")
         , it "Select a Weight" (SelectWeight "55")
         ]
            |> snapshotUpdateTuple initialModel update
        )
    ]
