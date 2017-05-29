import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const Policies = new Mongo.Collection('Policies');

Policies.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: "Associated User ID",
        //Remove optional
        //optional: true
    },
    companyId: {
        type: String,
        label: "Associated Company ID",
        //Remove optional
        optional: true
    },
    agentId: {
        type: String,
        label: "Associated Agent ID",
        //Remove optional
        optional: true
    },
    policyName: {
        type: String,
        label: "policyName",
        max: 50,
        optional: true
    },
    uploadDate: {
        type: Date,
        label: "uploadDate",
        optional: true
    },
    startDate: {
        type: Date,
        label: "startDate",
        optional: true
    },
    expDate: {
        type: Date,
        label: "expDate",
        optional: true
    },
    policyStatus: {
        type: String,
        label: "policyStatus",
        optional: true
    },
    uApproved: {
        type: Boolean,
        label: "policyStatus",
        optional: true
    },
    coverage: {
        type: String,
        label: "coverage",
        optional: true
    },
    coverageInfo: {
        type: Object,
        label: "coverage",
        blackbox: true
    },
    imageurl: {
        type: String,
        label: "imageurl"
    },
    uploadedBy: {
        type: String,
        label: "coverage"
    },
    isPast: {
        type: Boolean,
        defaultValue: false
    },
    reqCertID:{
        type: String,
        optional:true
    },
    createdBy: {
        type: String,
        autoValue: function () {
            if (this.isInsert && Meteor.userId()) {
                return Meteor.userId();
            }
            else {
                return "req_cert_agent";
            }
        }
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    },
    updateBy: {
        type: String,
        autoValue: function () {
            if (this.isInsert && Meteor.userId()) {
                return Meteor.userId();
            }
            else {
                return "req_cert_agent";
            }
        }
    },
    updateAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
}));