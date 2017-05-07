import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import './dash.html';

Template.dash.helpers({
  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  }
});

Template.companyTable.helpers({
  actSelector:function(){
    return {userId:Meteor.userId()};
  }
});

Template.dash.events({
});

Template.dash.onCreated(function () {

});

Template.companyTable.onRendered(function(){
  initDataTableComponents();
  $('body').addClass('has-detached-left');
});
