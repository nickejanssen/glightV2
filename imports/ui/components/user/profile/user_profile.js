import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import './user_profile.html';

Template.user_profile.helpers({
	currentDate: function () {
		let cdate = moment().format("MMMM Do YYYY");
    return cdate ;
	},
	LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
	},
	UserPhone() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.phone;
	},
	UserEmail() {
    let _user = Meteor.user();
    if (_.isObject(_user))
			return _user.emails[1];
	},
	UserCo() {
    let _user = Meteor.user();
    if (_.isObject(_user))
			return _user.emails.profile.cname;
  }
});

Template.user_profile.onRendered(() => {
  $('select').not('.disabled').material_select();
});