import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { moment } from "meteor/momentjs:moment";
import { Accounts } from 'meteor/accounts-base';
import { History } from '/imports/api/history/history.js';
import './dash.html';

var uploader = new ReactiveVar();
var imageurl = new ReactiveVar();

Template.dash.onCreated(function () {
  Session.set('activeCompany',undefined);
  Session.set('dashboardCount',undefined);
  Session.set('historyCount', 10);
  Tracker.autorun(() => {
    //console.log('getHistory');
    Meteor.subscribe("dashboardHistory", Session.get('historyCount'))
  });

  Meteor.call('dashboardCount',function(error,result){
    if(result){
      var Count = Enumerable.From(result)
            .GroupBy("{ userId: $.userId }", null,
                function(key, g) {
                    var companyObj = {
                        userId: key.userId,
                        Current: g.Sum("$.activeCerts"),
                        Pending: g.Sum("$.waitingCerts"),
                        Past: g.Sum("$.expiredCerts")
                    }
                    return companyObj;
                },
                function(x) {
                    return x.userId
                }).ToArray();
       Session.set('dashboardCount',Count);
    }
  });
  Meteor.call('activeCompany',function(error,result){
    if(result){
      Session.set('activeCompany',result);
    }
  })
});

Template.dash.onRendered(function(){
  $('body').addClass('has-detached-left');
});

Template.dash.helpers({
  LoginUserName() {
    let _user = Meteor.user();
    if (_.isObject(_user))
      return _user.profile.fname + " " + _user.profile.lname;
  },
  isUploading: function () {
    return Boolean(uploader.get());
  },
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100);
  },
  url: function () {
    return imageurl.get();
  },
  allHistory() {
    return History.find({}, { sort: { createdAt: -1 } });
  },
  policyCount(){
    return Session.get('dashboardCount')[0];
  },
  activeCompany(){
    return Session.get('activeCompany');
  }
});

Template.companyTable.helpers({
  actSelector:function(){
    return {userId:Meteor.userId()};
  }
});

Template.dash.events({
  'change #profilePic': function(event, template){
    $('.showImage').show();
    var metaContext = {
      userId: Meteor.userId()
    }

    var upload = new Slingshot.Upload("myImageUploads", metaContext);

    upload.send(document.getElementById('profilePic').files[0],
      function (error, downloadUrl) {
        uploader.set();

        if (error) {
          console.error('Error uploading');
          alert(error);
        } else {
          imageurl.set(downloadUrl);
        }

      });
    uploader.set(upload);
  },
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
    profile.imageurl = imageurl.get();

    //Agent Info
    profile.aname = event.currentTarget.aname.value.trim();
    profile.aemail = event.currentTarget.aemail.value.trim();

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
  },
  'click .settingsClick': function (event, template){
    $('.showImage').hide();
  },
  'click #btnLoadMore': function (e, t) {
    e.preventDefault();
    Session.set('historyCount', Session.get('historyCount') + 10); //inc count
  },

});

Template.companyTable.onRendered(function(){
  initDataTableComponents();
});
