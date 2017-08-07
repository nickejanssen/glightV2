import { Meteor } from 'meteor/meteor';
import { Policies } from '/imports/api/policies/policies.js';
import { Company } from '/imports/api/company/company.js';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';
import moment from 'moment';
import { Email } from 'meteor/email';

Meteor.methods({
    welcomeEmail(){
        console.log('welcomeEmail');
    },

    addCompanyEmail(companyID){

    },

    // reqNewCertEmail(reqCertID){
    //
    // },

    reqRemindEmail(reqCertDetail){
        //console.log('reqCertDetail', reqCertDetail);
    },
    'supportEmail'(supportData) {
        this.unblock();

        options = {
        from: 'supportrequests@thecertcollector.com',
        to: 'nickejanssen@gmail.com',
        bcc: '',
        subject: 'Support Request!',
        text: 'A support request from: ' + supportData.name + '\n User Id: ' + supportData.id + '\n User Email: ' + supportData.email + '\n Issue Types: ' + supportData.issTypes + '\n Message: \n' + supportData.mess + '\n \nPlease Take care of this quickly!',
        //html: '<b>A support request from: </b>' + name + '<br/><b>User Id:</b> ' + id + '<br/><b>User Email:</b> ' + email + '<br/><b>Issue Types:</b> ' + issTypes + '<br/><b>Message:</b> ' + mess + '<br/> <strong>Please Take care of this quickly!</strong>'
        };

        Email.send(options);

        //Meteor.call('insertHistory');

  }


});
