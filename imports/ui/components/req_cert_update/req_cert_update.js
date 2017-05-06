import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { coverageType } from '/imports/api/constant.js';
import './req_cert_update.html';
import '../../stylesheets/dropify/css/dropify.min.css';

let coEmail;

Template.req_cert_update.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  Tracker.autorun(() => {
    //Find Companies
    let _Companies = Company.find({});
    _self.companyDetail.set("AllCompanies", _Companies.fetch());

  });
});

Template.req_cert_update.helpers({
  AllCompanies() {
    let _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");
    //console.log("CompanyDetail Called: " + _CompanyDetail);
    return _CompanyDetail;
  },
  getCoverageType: function () {
    return coverageType;
  }
});

Template.req_cert_update.events({
  "change #certComp": function (event) {
    let selectedCo = $(event.target).val();
    let reqCompany = Company.findOne({ _id: selectedCo });
    coEmail = reqCompany.companyEmail;
    $('label[id*="lemail"]').text('');
    $("#cemail").val(coEmail);
  },

  'submit #formValidate'(e, t) {
    e.preventDefault();
    const userId = Meteor.userId();
    const company = t.$('#certComp').val();
    const coverage = t.$('#coverage').val();
    //const email =  t.$("input#cemail").val();
    const email = coEmail;
    //console.log(company + " " + coverage);

    //FIX THIS!!!
    let policyID = Router.current().params.policyID;
    Meteor.call('req_certificate.insert', { email: coEmail, coverage: coverage, companyID: company, policyID: policyID, type: "Update" }, (error, result) => {
      if (error) {
        alert(error);
      } else {
        //console.log(result);
        Meteor.call("sendMail", email, result);
        Materialize.toast("Update Request has been sent!", 8000, 'green');
        document.getElementById("formValidate").reset();
      }
    });
  },

  'click #btnAddCo'(e, t) {
    Router.go('/add-co');
  }
});

Template.req_cert_update.onRendered(() => {
  $('select').not('.disabled').material_select();
});

