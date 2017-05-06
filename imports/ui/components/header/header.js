import { Template } from 'meteor/templating';
import '../user/profile_menu.js';
import './header.html';
import '../user/navMenu/navmenu.js';

Template.header.helpers({
  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  }
});

Template.header.onRendered(() => {
    $('.header-search-input').focus(
        function () {
            $(this).parent('div').addClass('header-search-wrapper-focus');
        }).blur(
        function () {
            $(this).parent('div').removeClass('header-search-wrapper-focus');
        });
});

Template.header.events({
    'click .logout': (event, template) => {
        event.preventDefault();
        Meteor.logout();
    }
});
