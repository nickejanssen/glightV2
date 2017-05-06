import { Meteor } from 'meteor/meteor';
import { Company } from '../company.js';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';


Meteor.publish("AllCompanies", function () {
  if (this.userId) {
    let _Company = Company.find({ userId: this.userId });
    if (_Company.count() > 0)
      return _Company;
  }

  this.ready();
});

Meteor.publish("AllActiveCompanies", function () {
  if (this.userId) {
    let _Company = Company.find({ userId: this.userId, archived: false });
    if (_Company.count() > 0)
      return _Company;
  }

  this.ready();
});

Meteor.publish("getCompanyDetailsFromRequest", function (reqcertID) {
  let requestCertData = RequestCertificate.find({ _id: reqcertID })
  let _Company = Company.find({ _id: requestCertData.fetch()[0].companyID });
  if (_Company.count() > 0)
    return [requestCertData, _Company];

  this.ready();
});

Meteor.publish("getCompanyDetails", function (compID) {
  if (this.userId) {
    let _Company = Company.find({ userId: this.userId, _id: compID });
    if (_Company.count() > 0)
      return _Company;
  }

  this.ready();
});

Meteor.publish("requested_cert_byComp", function (compID) {
  console.log('compID',compID);
  let requestCertData = RequestCertificate.find({ userId: this.userId, companyID: compID, isuploaded: false });
  if (requestCertData.count() > 0)
    return requestCertData;

  this.ready();
});
