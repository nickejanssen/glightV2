import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
export const  PolicyNotifications = new Mongo.Collection('PolicyNotifications');

PolicyNotifications.attachSchema(new SimpleSchema({
    policyId: {
        type: String,
      },
      'firstReminder': {
        type: Boolean,
        defaultValue: false
      },
      'secondReminder': {
        type: Boolean,
        defaultValue: false
      },
      'thirdReminder': {
        type: Boolean,
        defaultValue: false
      },
      'fourthReminder': {
        type: Boolean,
        defaultValue: false
      },
}));