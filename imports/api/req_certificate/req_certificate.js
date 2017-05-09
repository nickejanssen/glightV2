// Definition of the Request Certificate collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const RequestCertificate = new Mongo.Collection('req_cert');

RequestCertificate.attachSchema(new SimpleSchema({
    userId: {
        type: String,
    },
    email: {
        type: String,
    },
    companyID: {
        type: String,
    },
    policyID:{
        type: String,
        optional: true
    },
    coverage: {
        type: String,
    },
    type: {
        type: String,
    },
    isuploaded: {
        type: Boolean,
        defaultValue: false
    },
    autoReminded: {
        type: Boolean,
        defaultValue: false
    },
    createdAt: {
        type: Date,
        autoValue: function () {
            if (this.isInsert) {
                return new Date();
            }
        }
    }
}));
