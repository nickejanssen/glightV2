import { Meteor } from 'meteor/meteor';
import { Policies } from '../policies.js';

Meteor.publish("AllPolicies", function(compId) {

  if (this.userId) {
    let _Policies = Policies.find({companyId: compId});
    console.log(compId);
    if (_Policies.count() > 0)
      //console.log("SUccess");
      return _Policies;
    }
  this.ready();
});