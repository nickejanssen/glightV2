import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import './dash.html';

Template.dash.helpers({

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
});
