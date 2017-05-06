// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by limitless-theme.js.
import { name as packageName } from "meteor/limitless-theme";

// Write your tests here!
// Here is an example.
Tinytest.add('limitless-theme - example', function (test) {
  test.equal(packageName, "limitless-theme");
});
