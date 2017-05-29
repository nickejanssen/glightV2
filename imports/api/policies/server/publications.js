import { Meteor } from 'meteor/meteor';
import { Policies } from '../policies.js';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';


Meteor.publish("AllPolicies", function (compId) {

  if (this.userId) {
    let _Policies = Policies.find({ companyId: compId });
    let allReqID = [];
    _Policies.fetch().forEach(function (d) {
      if (d.reqCertID) {
        allReqID.push(d.reqCertID);
      }
    })
    console.log(compId);
    if (_Policies.count() > 0)
      //console.log("SUccess");
      return [_Policies, RequestCertificate.find({ _id: { $in: allReqID } })];
  }
  this.ready();
});