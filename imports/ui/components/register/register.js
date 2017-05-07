import { Template } from 'meteor/templating';
import '../../stylesheets/user/user.css';
import './register.html';
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
			profile.billaddress = event.currentTarget.billaddress.value.trim();
			profile.addline2 = event.currentTarget.addline2.value.trim() ;
			profile.billcity = event.currentTarget.billcity.value.trim();
			profile.billstate = event.currentTarget.billstate.value.trim();
			profile.billzip = event.currentTarget.billzip.value.trim();

			if(template.pageSession.get("userCreated")) {
				const Id = Users.findOne()._id;

			   Meteor.call("updateUserAccount", Id, profile, (error, result) => {
              if(error){
                 console.log(error.reason);
                 template.pageSession.set("errorMessage", error.reason);
              } else {
				     Router.go("/dash");
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
						Router.go("/dash"); // Redirect user if registration succeeds
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
