import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import './verify_email.html';

Template.VerifyEmail.onCreated(() => {
  this.pageSession = new ReactiveDict("");
});

Template.VerifyEmail.onRendered(() => {
  $('body').addClass("login-container");
  this.pageSession.set("errorMessage", "");

  const verifyEmailToken = Router.current().params.verifyEmailToken;
  Accounts.verifyEmail(verifyEmailToken, err => {
    if (err) {
      this.pageSession.set("errorMessage", err.message);
    } else {
      this.pageSession.set("errorMessage", "Your email address has been verified");
      Meteor.call('welcomeEmail');
    }
  });
});

Template.VerifyEmail.events({
  "click .go-home": function (e, t) {
    Router.go("/dash");
  }

});

Template.VerifyEmail.helpers({
  "errorMessage": function () {
    return pageSession.get("errorMessage");
  }

});
