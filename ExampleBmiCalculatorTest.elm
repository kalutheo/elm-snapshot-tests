module ExampleBmiCalculatorTest exposing (..)

import ExampleBmiCalculator exposing (..)
import SnapShotTest exposing (..)


tests =
    describe "A Small person BMI"
        ([ it "Select a Gender" (SelectGender Female)
         , it "Select a Height" (SelectHeight "150")
         , it "Select a Weight" (SelectWeight "55")
         ]
            |> runTests initialModel update
        )
