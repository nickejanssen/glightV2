import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import { Company } from '../../../api/company/company.js';
import { Policies } from '../../../api/policies/policies.js';
import { History } from '../../../api/history/history.js';
import './co_detail.html';
import { Session } from 'meteor/session';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';
import { coverageType, getCoverageVal, getCoverageLabels } from '/imports/api/constant.js';


Template.co_detail.helpers({
  AllCompanies: function () {
    var _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");

    return _CompanyDetail;
  },

  CompanyName: function () {
    var _CompanySelect = Template.instance().companyDetail.get("AllCompanies");
    var coName = _CompanySelect.companyName;
    // console.log(_CompanySelect.companyName);
    return coName;
  },

  PendingPolicies: function () {
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    let pending = _.filter(_PolicyDetail, (elem) => {
      if (elem.policyStatus == "not-received") return true;
      if (elem.policyStatus != "rejected" && elem.uApproved === false) return true;
      if (elem.policyStatus == "received" && elem.startDate > new Date()) return true;
    });

    return pending;
  },

  isPendingPolicies: function () {
    if (this.policyStatus == "not-received") return true;
    if (this.policyStatus != "rejected" && this.uApproved === false) return true;
    if (this.policyStatus == "received" && this.startDate > new Date()) return true;
  },

  CurrentPolicies: function () {
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    let current = _.filter(_PolicyDetail, (elem) => {
      if (elem.uApproved === true && elem.startDate <= new Date() && new Date() <= elem.expDate && elem.isPast == false) return true;
    });
    return current;

  },
  PastPolicies: function () {
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    let past = _.filter(_PolicyDetail, (elem) => {
      if (new Date() > elem.expDate || elem.isPast == true) return true;
    });
    return past;
  },

  PolicyName() {
    var _PolicySelect = Template.instance().policyDetail.get("AllPolicies");
    var poName = _PolicySelect.policyName;
    return poName;
  },

  requestedPolicies() {
    return RequestCertificate.find({});
  },

  allHistory() {
    return History.find({}, { sort: { createdAt: -1 } });
  },

  policyDetail() {
    return Session.get('policyDetail');
  },
  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  },
  Userrole() {
    return "Administrator";
  },
  coverageInfo(coverage) {
    let CoverageLabels = getCoverageLabels(coverage);
    let Labels = Object.keys(CoverageLabels);
    let policyDetail = Session.get('policyDetail');
    let html = '';
    if ($('#reqCovType').text() === $('#CovType').text()) {
      Labels.forEach(function (d, i) {
        if (policyDetail[0].coverageInfo[d] != undefined) {
          if (policyDetail[0].coverageInfo[d] === Session.get('reqCoverageInfo')[d]) {
            html += "<p><b>" + CoverageLabels[d] + ":</b> " + policyDetail[0].coverageInfo[d] + "</p>"
          }else {
            html += "<p class='redcolor'><b>" + CoverageLabels[d] + ":</b> " + policyDetail[0].coverageInfo[d] + "</p>"
          }
        }
        else {
          html += "<p><b>" + CoverageLabels[d] + ":</b> N/A</p>"
        }
      });
    } else {
      Labels.forEach(function (d, i) {
        if (policyDetail[0].coverageInfo[d] != undefined) {
          html += "<p><b>" + CoverageLabels[d] + ":</b> " + policyDetail[0].coverageInfo[d] + "</p>"
        }
        else {
          html += "<p><b>" + CoverageLabels[d] + ":</b> N/A</p>"
        }
      });
    }
    return html;
  },

  reqCoverage() {
    let policyDetail = Session.get('policyDetail');
    if (policyDetail[0].reqCertID) {
      let reqDetails = RequestCertificate.findOne({ _id: policyDetail[0].reqCertID });
      return reqDetails.coverage;
    }
    else {
      return false;
    }
  },
  reqCoverageInfo() {
    let policyDetail = Session.get('policyDetail');
    let reqDetails = RequestCertificate.findOne({ _id: policyDetail[0].reqCertID });
    let CoverageLabels = getCoverageLabels(reqDetails.coverage);
    let Labels = Object.keys(CoverageLabels);

    let html = '';
    Session.set('reqCoverageInfo', reqDetails.coverageInfo);
    Labels.forEach(function (d, i) {
      if (reqDetails.coverageInfo[d] != undefined) {
        html += "<p><b>" + CoverageLabels[d] + ":</b> " + reqDetails.coverageInfo[d] + "</p>"
      }
      else {
        html += "<p><b>" + CoverageLabels[d] + ":</b> N/A</p>"
      }
    });
    return html;
  },
});

Template.co_detail.onCreated(function () {
  let _self = this;
  Session.set('historyCount', 5);
  Session.set('compID', '');
  Session.set('policyID', '');
  Session.set('policyDetail', []);
  _self.companyDetail = new ReactiveDict();
  _self.policyDetail = new ReactiveDict();

  Tracker.autorun(() => {
    //console.log('2nd');
    var companyId = Router.current().params.companyId;

    //Find correct company
    let _Company = Company.findOne({ _id: companyId });
    _self.companyDetail.set("AllCompanies", _Company);

    //Find policies
    let _Policies = Policies.find({});
    _self.policyDetail.set("AllPolicies", _Policies.fetch());
  });

  Tracker.autorun(() => {
    //console.log('getHistory');
    Meteor.subscribe("getHistory", Router.current().params.companyId, Session.get('historyCount'))
  });

});

Template.co_detail.events({
  'click .co-archive': (e, t) => {
    let company = { _id: t.companyDetail.get("AllCompanies")._id };
    Meteor.call('archiveCompany', company, (error) => {
      if (error) {
        Materialize.toast(error.reason, 3000, 'red');
      } else {
        //Materialize.toast("Company archived successfully", 3000, 'green');
        swal("Company Archived!", "Don't worry, you can always unarchive it in the Archived Companies section.");
      }
    });
  },

  'click .co-un-archive': (e, t) => {
    let company = { _id: t.companyDetail.get("AllCompanies")._id };
    Meteor.call('unArchiveCompany', company, (error) => {
      if (error) {
        Materialize.toast(error.reason, 3000, 'red');
      } else {
        //Materialize.toast("Company unarchived successfully!", 3000, 'green');
        swal("Company Unarchived!", "It will now be visible in the Active Companies section.");
      }
    });
  },

  'click #approve': (e, t) => {
    let pid = $(e.currentTarget).attr("name");

    let policy = { _id: pid };
    Meteor.call('approvePolicy', policy, (error) => {
      if (error) {
        swal("Uh Oh!", error.reason, "error");
      } else {
        swal("Policy Approved!", "You can now view the policy in Current Certificates.", "success");
      }
    });
  },

  'click #reject': (e, t) => {

    $('#reject-modal').attr('data-policyID', $(e.currentTarget).attr("name"));
    $('#reject-modal').modal('show');

  },

  'click .unapprove': (e, t) => {
    let pid = $(e.currentTarget).attr("name");

    let policy = { _id: pid };
    Meteor.call('unapprovePolicy', policy, (error) => {
      if (error) {
        swal("Uh Oh!", error.reason, "error");
      } else {
        swal("Policy Unapproved!", "You can now reject the policy in Pending Certificates.", "warning");
      }
    });
  },

  'mouseover #approved': (e, t) => {
    $(e.target).html("Unapprove");
    $(e.target).removeClass("btn-primary").addClass("btn-danger").addClass("unapprove");
  },

  'mouseout #approved': (e, t) => {
    $(e.target).html("Approved");
    $(e.target).removeClass("btn-danger").addClass("btn-primary").removeClass("unapprove");
  },

  'click #btnUpload': (e, t) => {
    Session.set('compID', Router.current().params.companyId);
    Router.go('App.upload_cert');
  },

  'click .remind': function (e, t) {
    let req_certID = this._id;
    Meteor.call('remindReq', req_certID, function (err, res) {

    });
    swal("Success!", "Your reminder has been sent!", "success");
  },

  'click .delReq': function (e, t) {
    if (confirm('Are you sure you want to delete this request')) {
      Meteor.call('delReq', this._id, function (err, res) {
        if (err) {
          Materialize.toast(err.reason, 3000, 'red');
        }
        else {
          swal("Your request has been deleted!", "info");
        }
      });
    }
  },

  'click .linkUpdate': function (e, t) {
    e.preventDefault();
    Session.set('compID', Router.current().params.companyId);
    Session.set('policyID', this._id);
    Router.go('App.upload_cert');
  },

  'click .linkRequest': function (e, t) {
    e.preventDefault();
    Router.go('App.req-cert-update', { policyID: this._id });
  },

  'click #btnLoadMore': function (e, t) {
    e.preventDefault();
    Session.set('historyCount', Session.get('historyCount') + 10); //inc count
  },

  'click .viewPolicy': function (e, t) {
    Session.set('policyDetail', [Policies.findOne({ _id: this._id })]);
    $('#modal1').modal('show');
  },

  'click #btnRejectConfirm': (e, t) => {
    if (confirm('Are you sure you want to reject this request')) {
      Meteor.call('rejectPolicy', $('#reason-text').val(), $('#reject-modal').attr('data-policyID'), (error) => {
        $('#reject-modal').modal('hide');
        if (error) {
          swal("Uh Oh!", error.reason, "error");
        } else {
          swal("Policy Rejected", "Your Reasoning: ", "success");
        }
      });
    }
    else {
      $('#reject-modal').modal('hide');
    }
  }
});

Template.co_detail.onRendered(() => {
  $('body').addClass('has-detached-left');
  $('.panel [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#fff',
              opacity: 0.8,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #ddd'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });


  // Sidebar categories
  $('.category-title [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#000',
              opacity: 0.5,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #000'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none',
              color: '#fff'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });
  $('.sidebar-default .category-title [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#fff',
              opacity: 0.8,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #ddd'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });

  $('.category-collapsed').children('.category-content').hide();
  $('.category-collapsed').find('[data-action=collapse]').addClass('rotate-180');
  $('.category-title [data-action=collapse]').click(function (e) {
      e.preventDefault();
      var $categoryCollapse = $(this).parent().parent().parent().nextAll();
      $(this).parents('.category-title').toggleClass('category-collapsed');
      $(this).toggleClass('rotate-180');

      containerHeight(); // adjust page height

      $categoryCollapse.slideToggle(150);
  });
  $('.panel-collapsed').children('.panel-heading').nextAll().hide();
  $('.panel-collapsed').find('[data-action=collapse]').addClass('rotate-180');
  $('.panel [data-action=collapse]').click(function (e) {
      e.preventDefault();
      var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
      $(this).parents('.panel').toggleClass('panel-collapsed');
      $(this).toggleClass('rotate-180');

      containerHeight(); // recalculate page height

      $panelCollapse.slideToggle(150);
  });
});
