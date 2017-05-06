import { Template } from 'meteor/templating';
import '../user/profile_menu.js';
import './side.html';


Template.side.helpers({

  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  },
  Userrole() {
    return "Administrator";
  }

});

Template.side.onCreated(() => {

});

Template.side.onRendered(() => {
  // Materialize Dropdown
  $('.dropdown-button').dropdown({
    inDuration: 300, outDuration: 125,
    constrain_width: true, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on click
    alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
    gutter: 0, // Spacing from edge
    belowOrigin: true // Displays dropdown below the button
  });
});


