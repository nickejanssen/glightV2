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
    '30': 'c96cb3b2-f5d6-4de1-bb1f-a42013fd2aae',
    '15': '36cf4c99-ace1-4378-b933-bf42d8461cd8',
    '3': 'f20b8ef8-f941-4c29-a866-e708645d7a22',
    '1': 'f20b8ef8-f941-4c29-a866-e708645d7a22'
};

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

  'rejectPolicy'(rejReason, policyID) {
    this.unblock();
    Policies.update({_id:policyID}, {$set: {policyStatus:"rejected"}});
    let policyDetail = Policies.findOne({_id:policyID});
    let compDetail = Company.findOne({ _id: policyDetail.companyId });

    let requestDetails = { email: compDetail.companyEmail, coverage: policyDetail.coverage, companyID: policyDetail.companyId, coName:compDetail.companyName, policyID: policyDetail._id, type: "Update" }
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
      from: 'thecertcollectorrequests@thecertcollector.com', //'crew@getagreenlight.com'
      to: compDetail.companyEmail,
      subject: 'Policy Rejected',
      html: reason,
      headers: {
        "X-SMTPAPI": JSON.stringify({
          "sub": {
            ":companyName": [compDetail.companyName],
            ":requestedDocument": [compDetail.policyName],
            ":url": [uploadDocURL],
            "-reason-": [reason],
            "-coverage-": [getCoverageVal(policyDetail.coverage)],
            "-company-": [compDetail.companyName],
            "-contactName-": [compDetail.firstName + " " + compDetail.lastName ],
            "-email-": [compDetail.companyEmail],
            "-phone-": [compDetail.companyPhone],
          },
          // "category": ["Promotions"],
          "filters": {
            "templates": {
              "settings": {
                "enable": 1,
                "template_id": 'cc4a5338-dd62-4531-a2ca-cd84bee0d4cc'
              }
            }
          }
        })
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
      });
  },

  'reminderMail'(reminderType, policyDetail) {
    this.unblock();
    let compDetail = Company.findOne({ _id: policyDetail.companyId });

    let requestDetails = { email: compDetail.companyEmail, coverage: policyDetail.coverage, coverageInfo: policyDetail.coverageInfo, companyID: policyDetail.companyId, policyID: policyDetail._id, type: "Update" }
      console.log("Coverage: " + policyDetail.coverageInfo);
    requestDetails.userId = policyDetail.userId;
    requestDetails.createdAt = new Date();
    let reqID = RequestCertificate.insert(requestDetails);

    let uploadDocURL = Meteor.absoluteUrl('upload_cert_request/' + reqID);

    options = {
      from: 'thecertcollectorrequests@thecertcollector.com', //'crew@getagreenlight.com'
      to: compDetail.companyEmail,
      subject: 'Gentle Reminder',
      html: 'html',
      headers: {
        "X-SMTPAPI": JSON.stringify({
          "sub": {
            "-companyName-": [compDetail.companyName],
            "-requestedDocument-": [compDetail.policyName],
            ":url": [uploadDocURL]
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
        })
      }
    };

    Email.send(options);
    console.log("Reminder Email Sent for " + compDetail.companyName + " " + compDetail.policyName);
    Meteor.call('insertHistory', policyDetail.companyId, 'upload', 'Automatic reminder for ' + getCoverageVal(policyDetail.coverage));
  },


  audit(startDate, endDate, coverageType, isEmailSend, companyID) {
    //console.log(startDate, endDate, coverageType);
    var fs = Npm.require("fs");
    var waitonmethod = new Future();
    var response = {};
    response.code = 400;
    response.fileName = 'auditData_' + (+new Date()) + '.csv';
    let selector = { userId: this.userId, createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) }, coverage: coverageType };
    if (companyID && companyID != "-1") {
      selector.companyId = companyID;
    }
    let allPolicies = Policies.find(selector).fetch();
    console.log('allPolicies', allPolicies, coverageType);
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

    let base = process.env.PWD + "/";
    console.log("PWD: " + base);

    let fileDownloadPath = Meteor.settings.fileDownloadPath;
    fs.writeFile(fileDownloadPath + response.fileName, csv, Meteor.bindEnvironment(function (err) {
      //console.log(response);
      console.log("Root: " + rootDir);
      console.log("PWD: " + base);
      if (err) {
        waitonmethod.return(err);
      } else {
        if (isEmailSend) {
          let options = {
            from: 'thecertcollectorrequests@thecertcollector.com',
            to: Meteor.user().emails[0].address,
            subject: getCoverageVal(coverageType) + ' Audit',
            attachments: [{   // file on disk as an attachment
              fileName: response.fileName,
              filePath: fileDownloadPath + response.fileName // stream this file
            }]
          };

          Email.send(options);
        }
        response.code = 200;
        waitonmethod.return(response);
      }
    }));
    return waitonmethod.wait();
  },

  certUploaded(policyID) {
    const policyDetail = Policies.findOne({ _id: policyID });

    if (policyDetail) {
      const userDetails = Meteor.users.findOne({ _id: policyDetail.userId });
      const companyDetails = Company.findOne({ _id: policyDetail.companyId });

      const options = {
        from: 'thecertcollectorrequests@thecertcollector.com', //'crew@getagreenlight.com'
        to: userDetails.emails[0]['address'],
        subject: 'Certificate Uploaded',
        html: 'html',
        headers: {
          "X-SMTPAPI": JSON.stringify({
            "sub": {
              "-companyName-": [companyDetails.companyName],
              "-uploadedDocument-": [getCoverageVal(policyDetail.coverage)],
            },
            "filters": {
              "templates": {
                "settings": {
                  "enable": 1,
                  "template_id": '4827275d-57dc-4a3c-94f1-b7b7657a2486'
                }
              }
            }
          })
        }
      };

      Email.send(options);
    }
  }

});

function sendNotification(policyDetail, currentDate) {
  console.log('currentDate ', currentDate);
  let notificationDetails = PolicyNotifications.findOne({ policyId: policyDetail._id });

  if (new Date(policyDetail.expDate) > currentDate) {
    let diffInDays = moment(policyDetail.expDate).diff(moment(currentDate), 'days');
    console.log('Difference in Days: ', diffInDays);
    if (notificationDetails) {
      if (diffInDays == 30 && notificationDetails['firstReminder'] == false) {
        console.log('30', 'email sent');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'firstReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      if (diffInDays == 15 && notificationDetails['firstReminder'] == false) {
        console.log('15', 'email sent');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'secondReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      else if (diffInDays == 3 && notificationDetails['secondReminder'] == false) {
        console.log('3', 'email sent');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'thirdReminder': true } });
        console.log('3', 'email sent');
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }
      else if (diffInDays == 1 && notificationDetails['thirdReminder'] == false) {
        console.log('1', 'email sent');
        //update notificationDetails
        PolicyNotifications.update({ _id: notificationDetails._id }, { $set: { 'fourthReminder': true } });
        Meteor.call('reminderMail', diffInDays, policyDetail);
      }

    }
  }
}
