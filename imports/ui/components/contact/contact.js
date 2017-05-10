import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { coverageType } from '/imports/api/constant.js';
import './contact.html';
import '../help/help.js';

Template.contact_form.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  Tracker.autorun(() => {
    //Find Companies
    let _Companies = Company.find({});
    _self.companyDetail.set("AllCompanies", _Companies.fetch());

  });
});

Template.contact_form.helpers({
  AllCompanies() {
    let _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");
    return _CompanyDetail;
  },

  getCoverageType: function () {
    return coverageType;
  }
});

Template.contact_form.events({
  'submit #contactForm'(e, t) {
    e.preventDefault();
		const userId = Meteor.userId();
		const uName = t.$('#uName').val();
    const uEmail = t.$('#email').val();
    const issueTypes = e.currentTarget.issueType.value.trim();
    const message = t.$('#message').val();

    Meteor.call('supportEmail', { id: userId, email: uEmail, name: uName, issTypes: issueTypes, mess: message }, (error, result) => {
      if (error) {
        swal("Uh Oh!", error, "error");
      } else {
        Meteor.call("sendMail", email, result);
        swal({
          title: "Your  support request has been sent!",
          text: "We will email you to follow up on your request.",
          type: "success",
          timer: 4000,
          showConfirmButton: true
        });
        document.getElementById("formValidate").reset();
      }
    });
  }
});

Template.contact_form.onRendered(() => {
  $('.select').select2();
  $(".multiselect").select2({
      placeholder: "Issue types."
    });
});