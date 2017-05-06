import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import { Company } from '../../../api/company/company.js';
import { Policies } from '../../../api/policies/policies.js';
import './pol_detail.html';


Template.pol_detail.helpers({
   AllCompanies:function(){
     var _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");

      return _CompanyDetail;
  },

  PendingPolicies:function(){
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    // console.log("_PolicyDetail All Policy:::::::::::::::::::::");
    // console.log(_PolicyDetail);
    return _.filter(_PolicyDetail, (elem) => {
      if (elem.policyStatus == "not-received") return true;
      if (elem.uApproved == false) return true;
      if(elem.policyStatus == "received" && elem.startDate > new Date()) return true;
    });
  },
  isPendingPolicies:function() {
    if (this.policyStatus == "not-received") return true;
    if (this.uApproved == false) return true;
    if (this.policyStatus == "received" && this.startDate > new Date()) return true;
  },

  CurrentPolicies:function(){
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    return _.filter(_PolicyDetail, (elem) => {
      return new Date() <= elem.expDate
    });
  },

  PastPolicies:function(){
    var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
    return _.filter(_PolicyDetail, (elem) => {
      return new Date() > elem.expDate
    });
  },

  PolicyName() {
  var _PolicySelect = Template.instance().policyDetail.get("AllPolicies");
     var poName = _PolicySelect.policyName;
        return poName;
  }
  /*modal() {
    MaterializeModal.message({
      title: 'Title',
      message: 'some message'
    });
  }*/

});

Template.pol_detail.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  _self.policyDetail = new ReactiveDict();

  Tracker.autorun(() => {
    FlowRouter.watchPathChange();
    var context = FlowRouter.current();
    var companyId = FlowRouter.getParam("companyId");

    //Find correct company
    let _AllCompanies = Meteor.subscribe("AllCompanies");

    if (_AllCompanies.ready()) {
      let _Company = Company.findOne({ _id: companyId });
      _self.companyDetail.set("AllCompanies", _Company);
    }

    //Find policies
    let _AllPolicies = Meteor.subscribe("AllPolicies", companyId);
    //let _Policies = Policies.find({});
    if (_AllPolicies.ready()) {
      let _Policies = Policies.find({});
      _self.policyDetail.set("AllPolicies", _Policies.fetch());
    }
  });

});

Template.pol_detail.events({
  'click .co-archive': (e, t) => {
    let company = {_id: t.companyDetail.get("AllCompanies")._id};
           Meteor.call('archiveCompany', company, (error) => {
              if(error){
                Materialize.toast(error.reason, 3000, 'red');
              } else {
                Materialize.toast("Company archived successfully", 3000, 'green');
          }
        });
  },

  'click .co-un-archive': (e, t) => {
    let company = {_id: t.companyDetail.get("AllCompanies")._id};
            Meteor.call('unArchiveCompany', company, (error) => {
              if(error){
                Materialize.toast(error.reason, 3000, 'red');
              } else {
                Materialize.toast("Company unarchived successfully!", 3000, 'green');
          }
        });
  },

  'click #approve': (e, t) => {
    let pid = $("#approve").attr("name");
    console.log(pid);
    //let policy = { _id: pid };
    console.log(policy);
    let policy = {_id: pid};
            Meteor.call('approvePolicy', policy, (error) => {
              if(error){
                Materialize.toast(error.reason, 3000, 'red');
              } else {
                Materialize.toast("Policy Approved", 3000, 'green');
          }
        });
  },

  'click #unapprove': (e, t) => {
    let pid = $("#unapprove").attr("name");
    console.log(pid);
    //let policy = { _id: pid };
    console.log(policy);
    let policy = {_id: pid};
            Meteor.call('unapprovePolicy', policy, (error) => {
              if(error){
                Materialize.toast(error.reason, 3000, 'red');
              } else {
                Materialize.toast("Policy Unapproved", 3000, 'red');
          }
        });
  },

  'mouseover .approved': (e, t) => {
    $(e.target).html("Unapprove");
    $(e.target).removeClass( "green" ).addClass( "red" );
  },

  'mouseout .approved': (e, t) => {
    $(e.target).html("Approved");
    $(e.target).removeClass( "red" ).addClass( "green" );
  }

});

Template.pol_detail.onRendered(() => {
  // $('select').not('.disabled').material_select();
});
