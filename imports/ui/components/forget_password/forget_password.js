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
                Materialize.toast("Email Sent. Check your mailbox.", 8000, 'green');
            }
        });

    }
});
