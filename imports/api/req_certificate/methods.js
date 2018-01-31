// Methods related to links
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { RequestCertificate } from './req_certificate.js';
import { coverageType, getCoverageVal, getCoverageLabels } from '/imports/api/constant.js';
import { Email } from 'meteor/email';
import moment from 'moment';

Meteor.methods({
  contactEmailSend(email, name, message) {
    let email2 = JSON.stringify(email);
    //console.log("Send Email Method: " + email + " " + name + " " + message);
    // Make sure that all arguments are strings.
    //check([email, name, message], [String]);

    // Let other method calls from the same client start running, without
    // waiting for the email sending to complete.
    this.unblock();

    options = {
      from: email.email,
      to: 'thecertcollector@gmail.com',
      bcc: 'nickejanssen@gmail.com',
      subject: 'Contact Us Message from: ' + email.name,
      text: "Message:" + "\n" + email.message
    };
    let options2 = JSON.stringify(options);
    console.log(options);
    //console.log(JSON.stringify(options));
    Email.send(options);
  },

  'req_certificate.insert'(req_certData) {
    req_certData.userId = this.userId;
    req_certData.createdAt = new Date();
    let existingUser = Meteor.users.findOne({ 'emails.address': req_certData.email });
    //if (existingUser) throw new Meteor.Error(499, "Unregistered users only!");
    // Meteor.call('insertHistory', req_certData.companyID, 'request', 'Requested for Document/Contract');
    return RequestCertificate.insert(req_certData);
  },

  'sendMail'(email, doc_id, isRemind) {
    this.unblock();
    let fileName = Meteor.settings.fileDownloadPath + this.userId + "/" + doc_id + "/coverage_info.pdf";
    let webshot = Npm.require('webshot');
    let fs = Npm.require('fs');
    let Future = Npm.require('fibers/future');

    let fut = new Future();
    let reqData = RequestCertificate.findOne({ _id: doc_id, userId: this.userId });
    // if(reqCertDetails.policyID){

    // }

    SSR.compileTemplate('emailCoverageInfo', Assets.getText('coverage_info.html'));

    Template.emailCoverageInfo.helpers({
      coverageInfo: function () {
        let CoverageLabels = getCoverageLabels(reqData.coverage);
        let Labels = Object.keys(CoverageLabels);
        let html = '';
        Labels.forEach(function (d, i) {
          html += "<p><b>" + CoverageLabels[d] + ":</b> " + reqData.coverageInfo[d] + "</p>"
        });
        return html;
      }
    });

    let html_string = SSR.render('emailCoverageInfo');

    // Setup Webshot options
    let webshotOptions = {
      "paperSize": {
        "format": "Letter",
        "orientation": "portrait",
        "margin": "1cm"
      },
      siteType: 'html'
    };

    // Commence Webshot
    console.log("Commencing webshot...");
    webshot(html_string, fileName, webshotOptions, Meteor.bindEnvironment(function (err) {
      let uploadDocURL = Meteor.absoluteUrl('upload_cert_request/' + doc_id);
      let options = {
        from: 'thecertcollectorrequests@getathecertcollector.com',
        to: email,
        bcc: '',
        subject: 'Certificate Upload',
        text: 'Please click the link below to upload the certificate:\n' + uploadDocURL + '\nor \n' + uploadDocURL + '\n Thank you!',
        html: 'Please click the link below to upload the certificate:\n' + uploadDocURL + '\nor \n' + uploadDocURL + '\n Thank you!',
        attachments: [{   // file on disk as an attachment
              fileName: "coverage_info.pdf",
              filePath: fileName // stream this file
            }],
        headers: {
          "X-SMTPAPI": {
            "sub": {
              ":url": [uploadDocURL],
              "-company-": [reqData.coName],
              "-coverage-": [getCoverageVal(reqData.coverage)]
            },
            "filters": {
              "templates": {
                "settings": {
                  "enable": 1,
                  "template_id": "a7593107-c56e-4e80-9777-40af3b5153b5"
                }
              }
            }
          }
        }
      };

      Email.send(options);
      if (isRemind) {
        Meteor.call('insertHistory', reqData.companyID, 'remind', 'Sent reminder for ' + getCoverageVal(reqData.coverage));
      }
      else {
        Meteor.call('insertHistory', reqData.companyID, 'request', 'Sent request for ' + getCoverageVal(reqData.coverage));
      }
    }));
  },
  testEmailSend() {
    options = {
      from: 'thecertcollectorrequests@getathecertcollector.com',
      to: 'piyushapex94@gmail.com',
      bcc: '',
      subject: 'Certificate Upload',
      headers: {
        "X-SMTPAPI": {
          "sub": {
            ":companyName": ["apex"],
            ":requestedDocument": ["text"]
          },
          "category": ["Promotions"],
          "filters": {
            "templates": {
              "settings": {
                "enable": 1,
                "template_id": "f20b8ef8-f941-4c29-a866-e708645d7a22"
              }
            }
          }
        }
      }
    };

    Email.send(options);
  },
  'remindReq'(reqID) {
    console.log('reqID', reqID);
    if (this.userId) {
      let req_certData = RequestCertificate.findOne({ _id: reqID, userId: this.userId });
      console.log(req_certData, this.userId, reqID);
      Meteor.call('sendMail', req_certData.email, reqID, true);

    }
  },
  'delReq'(reqID) {
    if (this.userId) {
      let req_certData = RequestCertificate.findOne({ _id: reqID, userId: this.userId });
      Meteor.call('insertHistory', req_certData.companyID, 'delete', 'Deleted request for ' + getCoverageVal(req_certData.coverage));
      return RequestCertificate.remove({ _id: reqID, userId: this.userId });
    }
  },
  processCertRequest() {
    let allRequestCertificate = RequestCertificate.find({ isuploaded: false, autoReminded: false }).fetch();
    let currentDate = new Date();
    allRequestCertificate.forEach((reqCertDetail, i) => {
      sendReqReminder(reqCertDetail, currentDate);
    })
  }
});

function sendReqReminder(reqCertDetail, currentDate) {
  let diffInDays = moment(currentDate).diff(moment(reqCertDetail.createdAt), 'days');
  //console.log('diffInDays', diffInDays);
  if (diffInDays >= 7) {
    RequestCertificate.update({ _id: reqCertDetail._id }, { $set: { autoReminded: true } });
    // Meteor.call('reqRemindEmail', reqCertDetail);
    let req_certData = RequestCertificate.findOne({ _id: reqID, userId: this.userId });
    console.log(req_certData, this.userId, reqID);
    Meteor.call('sendMail', reqCertDetail.email, reqCertDetail._id, true);
  }
}
