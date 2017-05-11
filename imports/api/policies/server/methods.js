import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Policies } from '../policies.js';
import { Company } from '/imports/api/company/company.js';
import { PolicyNotifications } from '../policyNotifications.js';
import moment from 'moment';
import { Email } from 'meteor/email';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';
import { coverageType, getCoverageVal } from '/imports/api/constant.js'

var Future = Npm.require('fibers/future');
var Fiber = Npm.require('fibers');

let policyUpdateReminderType = {
  '30':'c96cb3b2-f5d6-4de1-bb1f-a42013fd2aae',
  '15':'36cf4c99-ace1-4378-b933-bf42d8461cd8',
  '3':'f20b8ef8-f941-4c29-a866-e708645d7a22'
}

Meteor.methods({
  AddNewPolicy(policyDetail) {
    //console.log('policyDetail',policyDetail, policyDetail.policyID);
    policyDetail.startDate = new Date(policyDetail.startDate);
    policyDetail.expDate = new Date(policyDetail.expDate);
    if (policyDetail.policyID) {
      Policies.update({ _id: policyDetail.policyID }, { $set: { isPast: true } })
    }
    if (policyDetail.reqCertID) {
      RequestCertificate.update({ _id: policyDetail.reqCertID }, { $set: { isuploaded: true } });
      let reqCertDetails = RequestCertificate.findOne({ _id: policyDetail.reqCertID });
      if (reqCertDetails.policyID) {
        Policies.update({ _id: reqCertDetails.policyID }, { $set: { isPast: true } })
      }
    }
    let pID = Policies.insert(policyDetail);
    PolicyNotifications.insert({ policyId: pID });

    Meteor.call('insertHistory', policyDetail.companyId, 'upload', getCoverageVal(policyDetail.coverage) + ' uploaded');
    return pID;
  },

  'approvePolicy'(policyDetail) {
    let policy = Policies.findOne({ _id: policyDetail._id });
    Policies.update(policyDetail._id, { $set: { uApproved: true } });
    Meteor.call('insertHistory', policy.companyId, 'upload', getCoverageVal(policy.coverage) + ' approved');
  },

  'unapprovePolicy'(policyDetail) {
    let policy = Policies.findOne({ _id: policyDetail._id });
    Policies.update(policyDetail._id, { $set: { uApproved: false } });
    Meteor.call('insertHistory', policy.companyId, 'upload', getCoverageVal(policy.coverage) + ' unapproved');
  },

  'rejectPolicy'(rejReason, policyDetail) {
    this.unblock();
    let compDetail = Company.findOne({ _id: policyDetail.companyId });

    let requestDetails = { email: compDetail.companyEmail, coverage: policyDetail.coverage, companyID: policyDetail.companyId, policyID: policyDetail._id, type: "Update" }
    console.log(rejReason);
    console.log(policyDetail);
    console.log(compDetail);
    console.log(compDetail.companyEmail);

    requestDetails.userId = policyDetail.userId;
    requestDetails.createdAt = new Date();
    let reqID = RequestCertificate.insert(requestDetails);
    let reason = rejReason;
    let uploadDocURL = Meteor.absoluteUrl('upload_cert_request/' + reqID);

    options = {
      from: 'greenlightrequests@getagreenlight.com', //'crew@getagreenlight.com'
      to: compDetail.companyEmail,
      subject: 'Policy Rejected',
      headers: {
        "X-SMTPAPI": {
          "sub": {
            ":companyName": [compDetail.companyName],
            ":requestedDocument": [compDetail.policyName],
            ":url": [uploadDocURL],
            ":reason": reason
          },
         // "category": ["Promotions"],
          "filters": {
            "templates": {
              "settings": {
                "enable": 1,
                "template_id": ''
              }
            }
          }
        }
      }
    };

    Email.send(options);
    Meteor.call('insertHistory', policyDetail.companyId, 'reject', 'Rejected policy for ' + getCoverageVal(policyDetail.coverage));
  },

  'processPolicies'() {
    let allApprovedPolicies = Policies.find({ uApproved: true, isPast: false }).fetch();
    let currentDate = new Date();
    allApprovedPolicies.forEach((policyDetail, i) => {
      sendNotification(policyDetail, currentDate);
    })
  },

  'reminderMail'(reminderType, policyDetail) {
    this.unblock();
    let compDetail = Company.findOne({ _id: policyDetail.companyId });

    let requestDetails = { email: compDetail.companyEmail, coverage: policyDetail.coverage, companyID: policyDetail.companyId, policyID: policyDetail._id, type: "Update" }
    requestDetails.userId = policyDetail.userId;
    requestDetails.createdAt = new Date();
    let reqID = RequestCertificate.insert(requestDetails);

    let uploadDocURL = Meteor.absoluteUrl('upload_cert_request/' + reqID);

    options = {
      from: 'greenlightrequests@getagreenlight.com', //'crew@getagreenlight.com'
      to: compDetail.companyEmail,
      subject: 'Gentle Reminder',
      headers: {
        "X-SMTPAPI": {
          "sub": {
            ":companyName": [compDetail.companyName],
            ":requestedDocument": [compDetail.policyName],
            ":url":[uploadDocURL]
          },
         // "category": ["Promotions"],
          "filters": {
            "templates": {
              "settings": {
                "enable": 1,
                "template_id": policyUpdateReminderType[reminderType]
              }
            }
          }
        }
      }
    };

    Email.send(options);
    Meteor.call('insertHistory', policyDetail.companyId, 'upload', 'Automatic reminder for ' + getCoverageVal(policyDetail.coverage));
  },

  audit(startDate, endDate, coverageType) {
    //console.log(startDate, endDate, coverageType);
    var fs = Npm.require("fs");
    var waitonmethod = new Future();
    var response = {};
    response.code = 400;
    response.fileName = 'auditData_' + (+new Date()) + '.csv';
    let allPolicies = Policies.find({ userId:this.userId, createdAt: {$gte:new Date(startDate), $lt:new Date(endDate)}, coverage:coverageType }).fetch();
    //let allPolicies = Policies.find({}).fetch();
    let formatedData = allPolicies.map(function (d, i) {
      let certStartDate = moment(d.startDate).format('DD/MM/YYYY');
      let certExpDate = moment(d.expDate).format('DD/MM/YYYY');
      return { "No.": (i + 1), "Company Name": Company.findOne({ _id: d.companyId }).companyName, "Policy Name": d.policyName, "Coverage": getCoverageVal(d.coverage), "Start Date": certStartDate, "End Date": certExpDate };
    })
    var csv = Papa.unparse(formatedData, { header: true });
    //console.log(csv);

    let rootDir = process.cwd();
    console.log("Root: " + rootDir);

    let base = process.env.PWD +"/";
    console.log("PWD: " + base);

    //let fileDownloadPath = 'F:/glight_audit/'
    fs.writeFile(base + response.fileName, csv, function (err) {
      //console.log(response);
      console.log("Root: " + rootDir);
      console.log("PWD: " + base);
      if (err) {
        waitonmethod.return(err);
      } else {
        response.code = 200;
        waitonmethod.return(response);
      }
    });
    return waitonmethod.wait();
  }

});

function sendNotification(policyDetail, currentDate) {
  console.log('currentDate ', currentDate);
  let notificationDetails = PolicyNotifications.findOne({ policyId: policyDetail._id });

  if (new Date(policyDetail.expDate) > currentDate) {
    let diffInDays = moment(policyDetail.expDate).diff(moment(currentDate), 'days');
    console.log('diffInDays', diffInDays);
    if (notificationDetails) {
      if (diffInDays == 30 && notificationDetails['firstReminder'] == false) {
        console.log('30', 'email send');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'firstReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      if (diffInDays == 15 && notificationDetails['firstReminder'] == false) {
        console.log('15', 'email send');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'secondReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      else if (diffInDays == 3 && notificationDetails['secondReminder'] == false) {
        console.log('3', 'email send');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'thirdReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      else if (diffInDays == 1 && notificationDetails['thirdReminder'] == false) {
        console.log('1', 'email send');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'fourthReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }

    }
  }
}