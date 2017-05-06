import { Policies } from '/imports/api/policies/policies.js';

Policies.after.insert(function (userId, doc) {
    Meteor.call('updateCompCertCount', doc);       
});

Policies.after.update(function (userId, doc, fieldNames, modifier, options) {
  Meteor.call('updateCompCertCount', doc);
});