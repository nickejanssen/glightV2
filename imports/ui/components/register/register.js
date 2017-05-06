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
    'submit #msform': function(event, template){
			event.preventDefault();
      let profile =  {};

			//Basic Profile Info
			profile.cname = event.currentTarget.cname.value.trim();
			profile.fname = event.currentTarget.fname.value.trim() ;
			profile.lname = event.currentTarget.lname.value.trim();
			profile.phone = event.currentTarget.phone.value.trim();

			//Billing Info
			// profile.billaddress = event.currentTarget.billaddress.value.trim();
			// profile.addline2 = event.currentTarget.addline2.value.trim() ;
			// profile.billcity = event.currentTarget.billcity.value.trim();
			// profile.billstate = event.currentTarget.billstate.value.trim();
			// profile.billzip = event.currentTarget.billzip.value.trim();

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
	//jQuery time
	var current_fs, next_fs, previous_fs; //fieldsets
	var left, opacity, scale; //fieldset properties which we will animate
	var animating; //flag to prevent quick multi-click glitches

	$(".next").click(function () {
		if (animating) return false;
		animating = true;

		current_fs = $(this).parent();
		next_fs = $(this).parent().next();

		//activate next step on progressbar using the index of next_fs
		$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

		//show the next fieldset
		next_fs.show();
		//hide the current fieldset with style
		current_fs.animate({ opacity: 0 }, {
			step: function (now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale current_fs down to 80%
				scale = 1 - (1 - now) * 0.2;
				//2. bring next_fs from the right(50%)
				left = (now * 50) + "%";
				//3. increase opacity of next_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({ 'transform': 'scale(' + scale + ')' });
				next_fs.css({ 'left': left, 'opacity': opacity });
			},
			duration: 800,
			complete: function () {
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	$(".previous").click(function () {
		current_fs = $(this).parent();
		previous_fs = $(this).parent().prev();
      if ($("fieldset").index(current_fs) === 0) return;
      if (animating) return false;
		animating = true;
		//de-activate current step on progressbar
		$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
		//show the previous fieldset
		previous_fs.show();
		//hide the current fieldset with style
		current_fs.animate({ opacity: 0 }, {
			step: function (now, mx) {
				//as the opacity of current_fs reduces to 0 - stored in "now"
				//1. scale previous_fs from 80% to 100%
				scale = 0.8 + (1 - now) * 0.2;
				//2. take current_fs to the right(50%) - from 0%
				left = ((1 - now) * 50) + "%";
				//3. increase opacity of previous_fs to 1 as it moves in
				opacity = 1 - now;
				current_fs.css({ 'left': left });
				previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
			},
			duration: 800,
			complete: function () {
				current_fs.hide();
				animating = false;
			},
			//this comes from the custom easing plugin
			easing: 'easeInOutBack'
		});
	});

	// $(".submit").click(function(){
	// 	return false;
	// })

});
