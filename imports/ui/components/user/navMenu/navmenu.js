import { Template } from 'meteor/templating';
import './navmenu.html';


Template.navmenu.onCreated(() => {
  //debugger;
});

Template.navmenu.onRendered(()=>{
  // Notification Dropdown
  $('.navmenu-button').dropdown({
    inDuration: 300, outDuration: 125,
    constrain_width: true, // Does not change width of dropdown to that of the activator
    hover: false, // Activate on click
    alignment: 'left', // Aligns dropdown to left or right edge (works with constrain_width)
    gutter: 0, // Spacing from edge
    belowOrigin: true // Displays dropdown below the button
    }
  );

});

Template.navmenu.events({
    'click .logout': (event) => {
        event.preventDefault();
        Meteor.logout();
        Router.go('/login');
    },

    'click #acctSettings': (event) => {
      event.preventDefault();
  }


});

Template.navmenu.helpers({

  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  },
  Userrole() {
    return "Administrator";
  }

});

