import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { coverageType } from '/imports/api/constant.js';
import './req_cert.html';
import '../../stylesheets/dropify/css/dropify.min.css';

let coEmail;

Template.req_cert.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  Tracker.autorun(() => {
    //Find Companies
    let _Companies = Company.find({});
    _self.companyDetail.set("AllCompanies", _Companies.fetch());

  });
});

Template.req_cert.helpers({
  AllCompanies() {
    let _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");
    return _CompanyDetail;
  },
  getCoverageType: function () {
    return coverageType;
  },
  chooseCov: function () {
    var name = Session.get('currentCov');
    console.log(name);
    Meteor.setTimeout(function () {}, 20);
    if (name) {
      return { template: Template[name] };
    } else {
      return;
    }
  }
});

Template.req_cert.events({
  "change #certComp": function (event) {
    let selectedCo = $(event.target).val();
    let reqCompany = Company.findOne({ _id: selectedCo });
    coEmail = reqCompany.companyEmail;
    $('label[id*="lemail"]').text('');
    $("#cemail").val(coEmail);
  },

  'submit #formValidate'(e, t) {
    e.preventDefault();
    let selectedCo = t.$('#certComp').val();
    let reqCompany = Company.findOne({ _id: selectedCo });
    const userId = Meteor.userId();
    const company = selectedCo;
    const cname = reqCompany.companyName;
    const coverage = e.currentTarget.certCove.value.trim();
    const email = coEmail
    const coverageInfo = $('#' + Session.get('currentCov')).serializeObject();
    console.log(coverageInfo);
    Meteor.call('req_certificate.insert', { email: coEmail, coverage: coverage, companyID: company, coName: cname, type: "New Upload" }, (error, result) => {
      if (error) {
        alert(error);
      } else {
        Meteor.call("sendMail", email, result);
        swal({
          title: "Your request has been sent!",
          text: "We will update you when your request has been fulfilled.",
          type: "success",
          timer: 4000,
          showConfirmButton: true
        });
        document.getElementById("formValidate").reset();
      }
    });
  },

  'click #btnAddCo'(e, t) {
    Router.go('/add-co');
  },

  "change #certCov": function (event) {
    let selectedCov = $(event.target).val();
    console.log("Triggered");
    if (selectedCov == "autoLiability") {
      Session.set('currentCov', "autoLiability");
    } else if (selectedCov == "evidProp") {
      Session.set('currentCov', "epc");
    } else if (selectedCov == "umbrella") {
      Session.set('currentCov', "umbrella");
    } else if (selectedCov == "genLiability") {
      Session.set('currentCov', "genLiability");
    } else if (selectedCov == "workComp") {
      Session.set('currentCov', "workComp");
    } else {
      Session.set('currentCov', "blank");
    }
  }
});

Template.req_cert.onRendered(() => {
  //$('.multiselect').select2();
  $('.select').select2();
  $(".multiselect").select2({
      placeholder: "Click here to select coverages."
    });
});