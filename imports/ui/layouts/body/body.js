import './body.html';

Template.App_body.events({
    'click .logout': (event) => {
        event.preventDefault();
        Meteor.logout();
        Router.go('/login');
    }
});

Template.App_body.helpers({

  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  },
  Userrole() {
    return "Administrator";
  },
  year() {
    return new Date().getFullYear();
  },

});

Template.App_body.onRendered(function(){
  $('body').addClass('navbar-top');
});

Template.App_body.onDestroyed(function(){
  $('body').removeClass('navbar-top');
});
