import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import './active.html';

Template.active.helpers({

});

Template.active.onCreated(function () {

});

Template.activeCompanyTable.onRendered(() => {
initDataTableComponents();
});

Template.activeCompanyTable.helpers({
  selector:function(){
    return {userId:Meteor.userId(), archived: false};
  }
});
