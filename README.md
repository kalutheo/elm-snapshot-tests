# elm snapshot tests :camera:

## Installation

`npm i elm-snapshots-tests`

`elm-package install kalutheo/elm-snapshot-tests`

## Why ?

[Snapshot Testing](https://facebook.github.io/jest/docs/en/snapshot-testing.html) is a technic used in frontend development for visual regression and graphical UI Testing. It has been democratized by [Jest](https://facebook.github.io/jest/) and it is a powerful way to unit test your code with very few efforts.

As jest documention states :

> snapshots can capture any serializable value and should be used anytime the goal is testing whether the output is correct

The Elm Update function of a program seems to be a great candidate for Snapshot Testing !

This library primary goal is to bring Snapshot Testing to Elm and facilitate business logic testing.

Before :

```elm
suite =
    describe "Bmi Calculator App"
        [ describe "A Small person BMI"
            [ test "Select a Gender" <|
                \_ ->
                    let
                        expectedModel =
                            { initialModel | gender = Female }

                        newModel =
                            update
                                (SelectGender Female)
                                initialModel
                                |> Tuple.first
                    in
                    Expect.equal newModel expectedModel
            , test "Select a Height" <|
                \_ ->
                    let
                        expectedModel =
                            { initialModel | height = "150" }

                        newModel =
                            update
                                (SelectHeight "150")
                                initialModel
                                |> Tuple.first
                    in
                    Expect.equal newModel expectedModel
            , test "Select a Weight" <|
                \_ ->
                    let
                        expectedModel =
                            { initialModel | weight = "55" }

                        newModel =
                            update
                                (SelectWeight "55")
                                initialModel
                                |> Tuple.first
                    in
                    Expect.equal newModel expectedModel
            ]
        ]
```

After : :rocket:

```elm
tests =
    [ describe "A small person BMI"
        ([ it "Select a Gender" (SelectGender Female)
         , it "Select a Height" (SelectHeight "150")
         , it "Select a Weight" (SelectWeight "55")
         ]
            |> snapshotUpdate initialModel update
        )
    , describe "A tall and slim person BMI"
        ([ it "Select a Gender" (SelectGender Male)
         , it "Select a Height" (SelectHeight "190")
         , it "Select a Weight" (SelectWeight "55")
         ]
            |> snapshotUpdate initialModel update
        )
    ]
```

The resulting Snapshot :

```javascript
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`A Small person BMI Select a Gender 1`] = `
Object {
  "msg": "SelectGender Female",
  "newModel": "{ height = \\"180\\", weight = \\"80\\", gender = Female }",
  "title": "Select a Gender",
}
`;

exports[`A Small person BMI Select a Height 1`] = `
Object {
  "msg": "SelectHeight \\"150\\"",
  "newModel": "{ height = \\"150\\", weight = \\"80\\", gender = Female }",
  "title": "Select a Height",
}
`;

exports[`A Small person BMI Select a Weight 1`] = `
Object {
  "msg": "SelectWeight \\"55\\"",
  "newModel": "{ height = \\"150\\", weight = \\"55\\", gender = Female }",
  "title": "Select a Weight",
}
`;
```

## Usage

1 - Write an Elm Snapshots Test file in your project directory (next to elm-package.json and package.json) : see `ExampleBmiCalculatorTest.elm`

2 - Run `elm-snapshots-test --name ExampleBmiCalculatorTest` (where name is the name of your Elm Snapshots Test Module)

3 - Your snapshots will appear in a `__snapshots__`
