import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const  Company = new Mongo.Collection('Company');

Company.attachSchema(new SimpleSchema({
    userId: {
        type: String,
        label: "Associated User ID",
        //Remove optional
        //optional: true
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
      companyEmail: {
        type: String,
        label: "copmanyEmail"
      },
      companyPhone: {
        type: String,
        label: "copmanyPhone"
      },
      archived: {
        type: Boolean,
        label: "archived",
        defaultValue: false
      },
      activeCerts: {
        type: Number,
        label: "activeCerts",
        defaultValue: 0,
        optional: false
      },
      waitingCerts: {
        type: Number,
        label: "waitingCerts",
        defaultValue: 0,
        optional: false
      },
      expiredCerts: {
        type: Number,
        label: "expiredCerts",
        defaultValue: 0,
        optional: false
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