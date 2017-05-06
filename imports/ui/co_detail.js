// import { Template } from 'meteor/templating';
// import { Meteor } from 'meteor/meteor';
// import { ReactiveDict } from 'meteor/reactive-dict';
// import { Tracker } from 'meteor/tracker';
// import { moment } from "meteor/momentjs:moment";
// import { Company } from '../../../api/company/company.js';
// import { Policies } from '../../../api/policies/policies.js';
// import './co_detail.html';
//
// Template.co_detail.helpers({
//    AllCompanies:function(){
//      var _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");
//     return _CompanyDetail;
//   },
//
//   CompanyName() {
//     var _CompanySelect = Template.instance().companyDetail.get("AllCompanies");
//     var coName = _CompanySelect.companyName;
//     //console.log(_CompanySelect.companyName);
//     return coName;
//    },
//
//   PendingPolicies:function(){
//     var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
//     return _.filter(_PolicyDetail, (elem) => {
//       if(elem.policyStatus == "not-received") return true;
//       if(elem.policyStatus == "received" && elem.startDate > new Date()) return true;
//     });
//   },
//
//   CurrentPolicies:function(){
//     var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
//     return _.filter(_PolicyDetail, (elem) => {
//       return new Date() <= elem.expDate
//     });
//   },
//
//   PastPolicies:function(){
//     var _PolicyDetail = Template.instance().policyDetail.get("AllPolicies");
//     return _.filter(_PolicyDetail, (elem) => {
//       return new Date() > elem.expDate
//     });
//   },
//
//   PolicyName() {
//     var _PolicySelect = Template.instance().policyDetail.get("AllPolicies");
//     var poName = _PolicySelect.policyName;
//     return poName;
//   }
// });
//
// Template.co_detail.onCreated(function () {
//   let _self = this;
//   _self.companyDetail = new ReactiveDict();
//   _self.policyDetail = new ReactiveDict();
//
//   Tracker.autorun(() => {
//     //FlowRouter.watchPathChange();
//     //var context = FlowRouter.current();
//     //var companyId = FlowRouter.getParam("companyId");
//
//     //Find correct company
//     let _AllCompanies = Meteor.subscribe("AllCompanies");
//
//     if (_AllCompanies.ready()) {
//       let _Company = Company.findOne({ _id: companyId });
//       _self.companyDetail.set("AllCompanies", _Company);
//     }
//
//     //Find policies
//     let _AllPolicies = Meteor.subscribe("AllPolicies");
//     //let _Policies = Policies.find({});
//     if (_AllPolicies.ready()) {
//       let _Policies = Policies.find({});
//       _self.policyDetail.set("AllPolicies", _Policies.fetch());
//     }
//
//   });
//
// });
//
// Template.co_detail.events({
//
//   'click .co-archive': (e, t) => {
//     let company = {_id: t.companyDetail.get("AllCompanies")._id};
//
//     /// Archive Confirm Dailog Start
//
//     swal({
//           title: "Are you sure to Archive Company?",
//           text: "You will not be able to recover this imaginary file!",
//           type: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#00cc00",
//           confirmButtonText: "Yes, Archive!",
//           closeOnConfirm: false
//         },
//         function(isConfirm){
//           if(isConfirm){
//             /// Archive Method Call Start
//             Meteor.call('archiveCompany', company, (error) => {
//               if(error){
//                 Materialize.toast(error.reason, 3000, 'red');
//               } else {
//                 Materialize.toast("Company archived successfully", 3000, 'green');
//               }
//             });
//             /// Archive Method Call End
//           }else{
//
//           }
//         });
//     /// Archive Confirm Dailog End
//   },
//
//   'click .co-un-archive': (e, t) => {
//     let company = {_id: t.companyDetail.get("AllCompanies")._id};
//     /// Archive Confirm Dailog Start
//     swal({
//           title: "Are you sure to unArchive Company?",
//           text: "You will not be able to recover this imaginary file!",
//           type: "warning",
//           showCancelButton: true,
//           confirmButtonColor: "#00cc00",
//           confirmButtonText: "Yes, unArchive!",
//           closeOnConfirm: false
//         },
//         function(isConfirm){
//           if(isConfirm){
//             /// Archive Method Call Start
//             Meteor.call('unArchiveCompany', company, (error) => {
//               if(error){
//                 Materialize.toast(error.reason, 3000, 'red');
//               } else {
//                 Materialize.toast("Company unarchived successfully!", 3000, 'green');
//               }
//             });
//             /// Archive Method Call End
//           }else{
//
//           }
//         });
//     /// Archive Confirm Dailog End
//   }
// });
//
// Template.co_detail.onRendered(() => {
//   $('select').not('.disabled').material_select();
// });
//
