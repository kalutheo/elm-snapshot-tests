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
        ([ it "Should Select a Gender" (SelectGender Female)
         , it "Should Select a Height" (SelectHeight "150")
         , it "Should Select a Weight" (SelectWeight "55")
         ]
            |> snapshotUpdate initialModel update
        )
    ]
```

The resulting Snapshot :

```javascript
// Jest Snapshot v1, https://goo.gl/fbAQLP

exports[`A Small person BMI Should Select a Gender 1`] = `
Object {
  "msg": "SelectGender Female",
  "newModel": "{ height = \\"180\\", weight = \\"80\\", gender = Female }",
  "title": "Select a Gender",
}
`;

exports[`A Small person BMI Should Select a Height 1`] = `
Object {
  "msg": "SelectHeight \\"150\\"",
  "newModel": "{ height = \\"150\\", weight = \\"80\\", gender = Female }",
  "title": "Select a Height",
}
`;

exports[`A Small person BMI Should Select a Weight 1`] = `
Object {
  "msg": "SelectWeight \\"55\\"",
  "newModel": "{ height = \\"150\\", weight = \\"55\\", gender = Female }",
  "title": "Select a Weight",
}
`;
```

## Usage

1 - Two options :

* Run `elm-snapshot-test init`. This will generate a sample app with a `tests` function containing some examples tests.
* Just add a `tests` function in your existing module (see examples )

2 - Run `elm-snapshots-test --name YourModuleName` (where name is the name of your Elm Module)

3 - Your snapshots will appear in a `__snapshots__` directory at the root of your project. This folder must be versioned and commited with your source code.

4 - Change your code and go back to step (2). If your test are failing, fix your code if it's a regression, then run `elm-snapshots-test --name YourModuleName --update` to update the snapshot.

For more informations on how to use snapshot testing : https://facebook.github.io/jest/docs/en/snapshot-testing.html
