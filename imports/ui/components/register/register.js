import { Template } from 'meteor/templating';
import '../../stylesheets/user/user.css';
import './register.html';
//import { Stripe } from 'meteor/mrgalaxy:stripe';
import { ReactiveDict } from 'meteor/reactive-dict';


Template.register.onCreated(function () {
    this.pageSession = new ReactiveDict("");
});

Template.register.helpers({
    errorMessage() {
        return Template.instance().pageSession.get("errorMessage");
    },
    userCreated() {
        return Template.instance().pageSession.get("userCreated");
    }
});

Template.register.events({
    'submit #register-form': function(event, template){
			event.preventDefault();
      let profile =  {};

			//Basic Profile Info
			profile.cname = event.currentTarget.cname.value.trim();
			profile.fname = event.currentTarget.fname.value.trim() ;
			profile.lname = event.currentTarget.lname.value.trim();
			profile.phone = event.currentTarget.phone.value.trim();

			//Billing Info
			/*profile.plan = $('input[name=plan]:checked', '#register-form').val();
			profile.object = 'card';
			profile.exp_month = event.currentTarget.exp_month.value.trim();
			profile.exp_year = event.currentTarget.exp_year.value.trim();
			profile.number = event.currentTarget.number.value.trim();
			profile.cvc = event.currentTarget.cvc.value.trim();
			console.log(profile.plan + profile.object + profile.exp_month + profile.exp_year + profile.number + profile.cvc);
			profile.billaddress = event.currentTarget.billaddress.value.trim();
			profile.addline2 = event.currentTarget.addline2.value.trim() ;
			profile.billcity = event.currentTarget.billcity.value.trim();
			profile.billstate = event.currentTarget.billstate.value.trim();
			profile.billzip = event.currentTarget.billzip.value.trim();
			*/
			if(template.pageSession.get("userCreated")) {
				const Id = Users.findOne()._id;

				Meteor.call("updateUserAccount", Id, profile, (error, result) => {
					if(error){
						console.log(error.reason);
						template.pageSession.set("errorMessage", error.reason);
					} else {
							Router.go('/login');
					}
				});

			} else {

				//Registration Info
				let email = event.currentTarget.email.value.trim(); // document.getElementById('email').value;
				let password =event.currentTarget.pass.value; //document.getElementById('password').value;
				let passwordAgain = event.currentTarget.cpass.value; //document.getElementById('passwordAgain').value;

				if (password !== passwordAgain) {
					console.log("Passwords Not the Same");
					return false;
				}

				Accounts.createUser({email: email,password: password,profile:profile}, function (err, result) {
			 		if (err) {
						console.log(err.reason); // Output error if registration fails
						template.pageSession.set("errorMessage", err.reason);
						} else {
							Router.go("/login"); // Redirect user if registration succeeds
					}
				});
			};

	}
});

Template.register.onRendered(() => { //console.log(Users.findOne());
   $('body').addClass("login-container");
   if(Users.findOne()) Template.instance().pageSession.set("userCreated", true);

	// $(".submit").click(function(){
	// 	return false;
	// })

});

//stripe-checkout.js
if (Meteor.isClient) {
  Template.hello.events({
    'click #pro': function(e) {
      e.preventDefault();
			let stripePK = Meteor.settings.public.stripe.pk;

			StripeCheckout.open({
        key: stripePK,
        amount: 1250,
        name: 'Pro Subscription',
        description: 'Unlimited Companies!',
        panelLabel: 'Subscribe',
        token: function(res) {
          stripeToken = res.id;
					let uEmail = res.email;
          Meteor.call('subscribePro', stripeToken, uEmail);
        }
      });
		},

		'click #free': function(e) {
      e.preventDefault();
			let stripePK = Meteor.settings.public.stripe.pk;

			StripeCheckout.open({
        key: stripePK,
        amount: 0,
        name: 'Free Subscription',
        description: 'We will not be charged!',
        panelLabel: 'Subscribe',
        token: function(res) {
          stripeToken = res.id;
					let uEmail = res.email;
          Meteor.call('subscribeFree', stripeToken, uEmail);
        }
      });
    }
  });
}
