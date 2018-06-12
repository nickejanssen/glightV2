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
  Session.set('selectedComp', undefined);
});

Template.audit.events({
  'click #accSettings'(event) {
    event.preventDefault();
      Router.go('/dash');
      setTimeout(() => {
        $('.breadcrumb-elements li a.accSettings').trigger('click');
      }, 200)
  },
});

Template.audit.helpers({
  getCoverageType: function () {
    return coverageType;
  },
  allCompany: function () {
    return Company.find();
  }
});

Template.policyTable.helpers({
  selector: function () {
    let auditCondition = { userId: Meteor.userId() };
    if (Session.get('AuditConfig')) {
      auditCondition.userId = Meteor.userId();
      auditCondition.createdAt = { $gte: new Date(Session.get('AuditConfig').strDate), $lt: new Date(Session.get('AuditConfig').endDate) };
      auditCondition.coverage = Session.get('AuditConfig').coverage;
    }
    if (Session.get('selectedComp') && Session.get('selectedComp') != "-1") {
      auditCondition.companyId = Session.get('selectedComp');
    }
    return auditCondition;
  }
});

Template.audit.events({
  'submit #formAudit'(e, t) {
    e.preventDefault();
    let coverageType = t.$('#coverage').val();
    let startDate = e.currentTarget.startDate.valueAsDate;
    let endDate = e.currentTarget.endDate.valueAsDate;
    let isEmailSend = $('#email').prop('checked');
    let selectedCompany = $('#company').val();
    Session.set('AuditConfig', { strDate: startDate, endDate: endDate, coverage: coverageType });

    Meteor.call('audit', startDate, endDate, coverageType, isEmailSend, selectedCompany, function (err, res) {
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
              if (!isEmailSend) {
                swal("All done!", "Audit file will be downloaded...");
              }
              else {
                swal("All done!", "Sent an Audit file to your mail.");
              }
              if (!isEmailSend) {
                window.open(Meteor.absoluteUrl() + 'downloadAudit/' + res.fileName, '_blank');
              }
            }, 2000);
          });
        //HERE
      }
    });

  },

  'change #company'(e, t) {
    Session.set('selectedComp', $('#company').val());
  }
});

Template.audit.onRendered(function () {
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
