import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const History = new Mongo.Collection('History');

History.attachSchema(new SimpleSchema({
    companyId: {
        type: String,
    },
    type: {
        type: String,
    },
    msg: {
        type: String
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