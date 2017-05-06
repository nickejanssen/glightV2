import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { moment } from "meteor/momentjs:moment";
import { Company } from '../../../api/company/company.js';
import { Policies } from '../../../api/policies/policies.js';
import { coverageType } from '/imports/api/constant.js';

import './audit.html';

Template.audit.onCreated(function () {
  let _self = this;
  Session.set('AuditConfig', undefined);
});

Template.audit.helpers({
  getCoverageType: function () {
    return coverageType;
  }
});

Template.policyTable.helpers({
  selector: function () {
    if (Session.get('AuditConfig')) {
      return { userId: Meteor.userId(), createdAt: { $gte: new Date(Session.get('AuditConfig').strDate), $lt: new Date(Session.get('AuditConfig').endDate) }, coverage: Session.get('AuditConfig').coverage };
    }
    else {
      return { userId: Meteor.userId() };
    }
  }
});

Template.audit.events({
  'submit #formAudit'(e, t) {
    e.preventDefault();
    let coverageType = t.$('#coverageType').val();
    let startDate = e.currentTarget.startDate.valueAsDate;
    let endDate = e.currentTarget.endDate.valueAsDate;
    Session.set('AuditConfig', { strDate: startDate, endDate: endDate, coverage: coverageType });

    Meteor.call('audit', startDate, endDate, coverageType, function (err, res) {
      if (res.code == 400) {

      }
      else {
        swal({
          title: "Your audit has begun!",
          text: "Your file will be available shortly.",
          type: "success",
          showCancelButton: false,
          closeOnConfirm: false,
          showLoaderOnConfirm: true,
        },
          function () {
            //console.log(res.fileName);
            setTimeout(function () {
            swal("All done!", "Select your location for download.");
            window.open('http://greenlight.meteorapp.com/downloadAudit/' + res.fileName, '_blank');
            //window.open('http://localhost:3000/downloadAudit/' + res.fileName, '_blank');
          }, 3000);
        });
        //HERE
      }
    });

  }
});

Template.audit.onRendered(function(){
  $('.select').select2();
});

Template.policyTable.onRendered(() => {
  initDataTableComponents();
  // $('select').not('.disabled').material_select();
  // Pikadate datepicker
  //   $('.datepicker').pickadate({
  //     selectMonths: true, // Creates a dropdown to control month
  //     selectYears: 15 // Creates a dropdown of 15 years to control year
  //   });
});
