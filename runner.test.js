const chalk = require('chalk');
const Elm = require("./.elm-snapshots/PrivateMain.js");
const log = console.log;

describe(snapshots.test, () => {
  snapshots.actions.forEach((snapshot) => {
    test(snapshot.title, () => {
      expect(snapshot).toMatchSnapshot();
    })
  })
});
