import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import './active.html';

Template.arch.helpers({

});

Template.arch.onCreated(function () {

});

Template.archCompanyTable.onRendered(() => {
initDataTableComponents();
});

Template.archCompanyTable.helpers({
  selector:function(){
    return {userId:Meteor.userId(), archived: false};
  }
});

Template.dash.events({
  /*'click #settingsTab': function (event, template) {
    // Javascript to enable link to tab
    var hash = document.location.hash;
    if (hash) {
        $('.navigation a[href='+hash+']').tab('show');
    }

    // Change hash for page-reload
    $('.navigation a').on('shown.bs.tab', function (e) {
        window.location.hash = e.target.hash;
    });
  }*/

});
