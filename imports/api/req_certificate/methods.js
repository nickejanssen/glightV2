// Methods related to links
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { RequestCertificate } from './req_certificate.js';
import { coverageType, getCoverageVal } from '/imports/api/constant.js'
import { Email } from 'meteor/email';
import moment from 'moment';

Meteor.methods({
  'req_certificate.insert'(req_certData) {
    req_certData.userId = this.userId;
    req_certData.createdAt = new Date();

    let existingUser = Meteor.users.findOne({ 'emails.address': req_certData.email });
    if (existingUser) throw new Meteor.Error(499, "Unregistered users only!");
    // Meteor.call('insertHistory', req_certData.companyID, 'request', 'Requested for Document/Contract');
    return RequestCertificate.insert(req_certData);
  },

  'sendMail'(email, doc_id, isRemind) { //console.log(email, doc_id);
    this.unblock();
    // let reqCertDetails = RequestCertificate.findOne({_id: doc_id});
    // if(reqCertDetails.policyID){

    // }
    let uploadDocURL = Meteor.absoluteUrl('upload_cert_request/' + doc_id);
    options = {
      from: 'greenlightrequests@getagreenlight.com',
      to: email,
      bcc: '',
      subject: 'Certificate Upload',
      text: 'Please click the link below to upload the certificate:\n' + uploadDocURL + '\nor \n' + uploadDocURL + '\n Thank you!',
      html: 'Please click the link below to upload the certificate:\n' + uploadDocURL + '\nor \n' + uploadDocURL + '\n Thank you!',
      headers: {
        "X-SMTPAPI": {
          "sub": {
            ":url": [uploadDocURL]
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
    let req_certData = RequestCertificate.findOne({ _id: doc_id, userId: this.userId });
    if (isRemind) {
      Meteor.call('insertHistory', req_certData.companyID, 'remind', 'Sent reminder for '+getCoverageVal(req_certData.coverage));
    }
    else {
      Meteor.call('insertHistory', req_certData.companyID, 'request', 'Sent request for '+getCoverageVal(req_certData.coverage));
    }

  },
  testEmailSend() {
    options = {
      from: 'greenlightrequests@getagreenlight.com',
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
      Meteor.call('insertHistory', req_certData.companyID, 'delete', 'Deleted request for '+getCoverageVal(req_certData.coverage));
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
    Meteor.call('reqRemindEmail', reqCertDetail);
  }
}
