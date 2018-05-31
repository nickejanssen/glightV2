import './forget_password.html';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.forgetPassword.onCreated(function () {
    var _self = this;
    _self.pageSession = new ReactiveDict("");
});

Template.forgetPassword.onRendered(function(){
  $('body').addClass("login-container");
});
Template.forgetPassword.helpers({
    errorMessage() {
        return Template.instance().pageSession.get("errorMessage");
    }
});

Template.forgetPassword.events({
    'click #btnSubmit' (e, template) {
        e.preventDefault();
        template.pageSession.set("errorMessage", "");
        Accounts.forgotPassword({
            email: $(event.currentTarget).find('#email').val()
        }, err => {
            if (err) {
                if (err.message === 'User not found [403]') {
                  template.pageSession.set("errorMessage", "This email does not exist.");
                } else {
                  template.pageSession.set("errorMessage", "We are sorry but something went wrong.");
                }
            } else {
                swal({
                    title: "Your request has been sent!",
                    text: "Please check your email for a link to reset your password.",
                    type: "success",
                    timer: 4000,
                    showConfirmButton: true
                });
                setTimeout(Router.go('/login'),5000);
            }
        });

    }
});
