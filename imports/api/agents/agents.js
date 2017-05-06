import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const Agents = new Mongo.Collection('Agents');

Agents.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: "Associated User ID",
        //Remove optional
        optional: true
    },
    companyId: {
        type: String,
        label: "Associated Company ID",
        //Remove optional
        optional: true
    },
    companyName: {
        type: String,
        label: "companyName",
        max: 50
    },
    firstName: {
        type: String,
        label: "firstName",
        max: 50
    },
    lastName: {
        type: String,
        label: "lastName",
        max: 50
    },
    agentEmail: {
        type: String,
        label: "agentsEmail"
    },
    agentPhone: {
        type: String,
        label: "copmanyPhone",
        optional: true
    },
    createdBy: {
        type: String,
        autoValue: function () {
            if (this.isInsert) {
                return Meteor.userId();
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
            if (this.isInsert) {
                return Meteor.userId();
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