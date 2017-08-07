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
	},

  'subscribePro': function(stripeToken, uEmail) {
    check(stripeToken, String);
    let stripeSK = Meteor.settings.private.stripe.sk;
    var Stripe = StripeAPI(stripeSK);
    console.log(stripeToken);
    console.log("User email: " + stripeToken.email);

    Stripe.customers.create({
      email: uEmail,
      source: stripeToken,
      plan: 'standardpricing'
    }, function(err, charge) {
      console.log(err, charge);
    });

    /*Stripe.charges.create({
      source: stripeToken,
      amount: 100,
      plan: 'standardpricing',
      currency: 'usd'
    }, function(err, charge) {
      console.log(err, charge);
    });*/
  },

  'subscribeFree': function(stripeToken, uEmail) {
    check(stripeToken, String);
    let stripeSK = Meteor.settings.private.stripe.sk;
    var Stripe = StripeAPI(stripeSK);
    console.log(stripeToken);
    console.log("User email: " + stripeToken.email);

    Stripe.customers.create({
      email: uEmail,
      source: stripeToken,
      plan: 'freePricing'
    }, function(err, charge) {
      console.log(err, charge);
    });

    /*Stripe.charges.create({
      source: stripeToken,
      amount: 100,
      plan: 'standardpricing',
      currency: 'usd'
    }, function(err, charge) {
      console.log(err, charge);
    });*/
  },

	checkPassword: function(digest) {
    check(digest, String);

    if (this.userId) {
      var user = Meteor.user();
      var password = {digest: digest, algorithm: 'sha-256'};
      var result = Accounts._checkPassword(user, password);
      return result.error == null;
    } else {
      return false;
    }
  }

});