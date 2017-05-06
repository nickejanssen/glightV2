import './reset_password.html';
import { ReactiveDict } from 'meteor/reactive-dict';

Template.resetPassword.onCreated(function () {
    var _self = this;
    _self.pageSession = new ReactiveDict("");
});

Template.resetPassword.helpers({
    errorMessage() {
        return Template.instance().pageSession.get("errorMessage");
    }
});

Template.resetPassword.events({
    'click #btnSubmit' (e, template) {
        e.preventDefault();
        template.pageSession.set("errorMessage", "");
        if($(event.currentTarget).find('#confirmPassword').val() != $(event.currentTarget).find('#password').val()){
          template.pageSession.set("errorMessage", "Both Password should be match.");
          return;
        }
        Accounts.resetPassword(Router.current().params.resetPassToken, $(event.currentTarget).find('#confirmPassword').val(), err => {
           if (err) {
               template.pageSession.set("errorMessage", "We are sorry but something went wrong.");
           } else {
             Materialize.toast("Your password has been changed. Welcome back!", 8000, 'green');
           }
       });
    }
});
