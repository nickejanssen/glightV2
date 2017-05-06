import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Company } from '../company.js';
import { Policies } from '/imports/api/policies/policies.js';

Meteor.methods({
  AddNewCompany(companyDetail) {
    Company.insert(companyDetail);
  },

  'archiveCompany'(companyDetail) {
    Company.update(companyDetail._id, { $set: { archived: true } });
  },

  'unArchiveCompany'(companyDetail) {
    Company.update(companyDetail._id, { $set: { archived: false } });
  },

  'updateCurrent'(companyDetail, actCerts) {
    Company.update(companyDetail._id, { $set: { activeCerts: actCerts } });
  },

  'updatePast'(companyDetail, pastCerts) {
    Company.update(companyDetail._id, { $set: { expiredCerts: pastCerts } });
  },

  'updatePending'(companyDetail, pendCerts) {
    Company.update(companyDetail._id, { $set: { waitingCerts: pendCerts } });
  },

  'updateCompCertCount'(doc) {
    //const compDetail = Company.findOne({ _id: doc.companyId });
    var _PolicyDetail = Policies.find({companyId: doc.companyId}).fetch();
    let company = { _id: doc.companyId };

    let pending = _.filter(_PolicyDetail, (elem) => {
      if (elem.policyStatus == "not-received") return true;
      if (elem.uApproved === false) return true;
      if (elem.policyStatus == "received" && elem.startDate > new Date()) return true;
    });
    let pendCert = pending.length;
    Meteor.call('updatePending', company, pendCert);

    let current = _.filter(_PolicyDetail, (elem) => {
      if (elem.uApproved === true && elem.startDate <= new Date() && new Date() <= elem.expDate && elem.isPast == false) return true;
    });
    let actCert = current.length;    
    Meteor.call('updateCurrent', company, actCert);

    let past = _.filter(_PolicyDetail, (elem) => {
      if (new Date() > elem.expDate || elem.isPast == true) return true;
    });
    let pastCert = past.length;
    Meteor.call('updatePast', company, pastCert);

    // if ((doc.policyStatus == "not-received") || (doc.uApproved === false) || (doc.policyStatus == "received" && doc.startDate > new Date())) {

    // }
    // else if (doc.uApproved === true && doc.startDate <= new Date() && new Date() <= doc.expDate && doc.isPast == false) {

    // }
    // else if (new Date() > doc.expDate || doc.isPast == true) {

    // }
  }
});