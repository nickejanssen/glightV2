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


});
