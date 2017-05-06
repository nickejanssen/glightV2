// Server entry point, imports all server code
import { Meteor } from 'meteor/meteor';
import {Users} from "meteor/perak:user-roles";

Meteor.methods({
	"updateUserAccount"(userId, options) { //console.log(options);

		if(userId !== Meteor.userId()) {
				throw new Meteor.Error(403, "Access denied.");
		}
      
		const profile = Users.findOne(userId).profile;
      _.extend(profile, options);
      console.log({ profile });
		Users.update(userId, { $set: { profile } });
	}

});