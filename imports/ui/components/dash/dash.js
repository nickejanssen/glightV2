import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import { Accounts } from 'meteor/accounts-base'
import './dash.html';

Template.dash.helpers({
  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  }
});

Template.companyTable.helpers({
  actSelector:function(){
    return {userId:Meteor.userId()};
  }
});

Template.dash.events({
  'submit #updateProfile': function (event, template) {
    event.preventDefault();
    let profile = {};

    //Basic Profile Info
    profile.cname = event.currentTarget.cname.value.trim();
    profile.fname = event.currentTarget.fname.value.trim();
    profile.lname = event.currentTarget.lname.value.trim();
    profile.phone = event.currentTarget.phone.value.trim();

    //Billing Info
    profile.billaddress = event.currentTarget.billaddress.value.trim();
    profile.addline2 = event.currentTarget.addline2.value.trim();
    profile.billcity = event.currentTarget.billcity.value.trim();
    profile.billstate = event.currentTarget.billstate.value.trim();
    profile.billzip = event.currentTarget.billzip.value.trim();

    const Id = Users.findOne()._id;
    Meteor.call("updateUserAccount", Id, profile, (error, result) => {
      if (error) {
        console.log(error.reason);
        template.pageSession.set("errorMessage", error.reason);
      } else {
        swal("Success!", "Your profile has been updated!", "success");
      }
    });
  },

  'submit #updateAccount': function (event, template) {
    event.preventDefault();
    const Id = Users.findOne()._id;

    //Update Password
    currentPass = event.currentTarget.currentPass.value.trim();
    newPass = event.currentTarget.newPass.value.trim();
    newPassAgain = event.currentTarget.newPassAgain.value.trim();
    swal({
      title: "Are you sure you want to change your password?",
      text: "Make sure you remember your new password.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, change it!",
      closeOnConfirm: false
    },
    function () {
      if (newPass !== newPassAgain) {
      console.log("Passwords Match!");
      swal("Uh Oh!", "Your new password's do not match.", "error");
      } else {
        Accounts.changePassword(currentPass, newPass, function(err){
          if(err){
            console.log(err);
            swal("Uh Oh!", err, "error");
          } else {
            console.log("Password Changed");
            swal("Success!", "Your password has been changed!", "success");
          }
        });
      }
    });
  }

});

Template.dash.onCreated(function () {

});

Template.companyTable.onRendered(function(){
  initDataTableComponents();
  $('body').addClass('has-detached-left');
});
