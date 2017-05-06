import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import './arch.html';

Template.arch.helpers({

});

Template.arch.onCreated(function () {

});

Template.archCompanyTable.onRendered(() => {
initDataTableComponents();
});

Template.archCompanyTable.helpers({
  selector:function(){
    return {userId:Meteor.userId(), archived: true};
  }
});
