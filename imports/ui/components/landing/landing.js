import { Template } from 'meteor/templating';
import './landing.html';

Template.landing.events({
	'click #contact-btn'(e, t) {
		e.preventDefault();
		document.getElementById('contact-us').style = "display: block;";
		},

	'submit #contact-us'(e, t) {
    e.preventDefault();
		const uName = t.$('#uName').val();
    const uEmail = t.$('#email').val();
    const message = t.$('#message').val();

    Meteor.call('contactEmailSend', { email: uEmail, name: uName, mess: message }, (error, result) => {
      if (error) {
        swal("Uh Oh!", error, "error");
      } else {
        Meteor.call("contactEmailSend", email, result);
        swal({
          title: "Your  message has been sent!",
          text: "We will email you to follow up on your message.",
          type: "success",
          timer: 4000,
          showConfirmButton: true
        });
        document.getElementById("formValidate").reset();
      }
    });
  }
});
