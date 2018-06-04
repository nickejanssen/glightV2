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
  Session.set('historyCount', 5);
  Session.set('AuditConfig', undefined);
  Tracker.autorun(() => {
    //console.log('getHistory');
    Meteor.subscribe("dashboardHistory", Session.get('historyCount'));
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
  //$('.collapse').collapse(show);
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
  },
  plans: function(){
    var getPlans = Meteor.settings.public.plans;
    if (getPlans) {
      return getPlans;
    }
  }

});

Template.policySummary.helpers({
  selector: function () {
    if (Session.get('AuditConfig')) {
      return { userId: Meteor.userId(), createdAt: { $gte: new Date(Session.get('AuditConfig').strDate), $lt: new Date(Session.get('AuditConfig').endDate) }, coverage: Session.get('AuditConfig').coverage };
    }
    else {
      return { userId: Meteor.userId() };
    }
  }
});

Template.companyTable.helpers({
  actSelector:function(){
    return {userId:Meteor.userId()};
  }
});

Template.dash.events({
  'click .list-group-item': function(e){
    var parent = $(e.target).closest('.list-group-item');
    parent.addClass("active");
    $('.list-group-item').not(parent).removeClass("active");
    parent.find('input[type="radio"]').prop("checked", true);
  },

  'change #profilePic': function (event, template) {
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
    Session.set('historyCount', Session.get('historyCount') + 5); //inc count
  },

});

Template.companyTable.onRendered(function(){
  initDataTableComponents();
  var firstPlanItem = $('.select-plan a:first-child');
  firstPlanItem.addClass('active');
  firstPlanItem.find('input').prop("checked", true);

  $('#updateBilling').validate({
    submitHandler: function(){
      // Take our card data and create a Stripe token from the client. This
      // ensures that our code is PCI compliant to keep the man from knocking
      // on our door.
      STRIPE.getToken( '#updateBilling', {
        number: $('[data-stripe="cardNumber"]').val(),
        exp_month: $('[data-stripe="expMo"]').val(),
        exp_year: $('[data-stripe="expYr"]').val(),
        cvc: $('[data-stripe="cvc"]').val()
      }, function() {

        // Grab the customer's details.
        var customer = {
          name: $('[name="fullName"]').val(),
          emailAddress: $('[name="emailAddress"]').val(),
          plan: $('[name="selectPlan"]:checked').val(),
          token: $('[name="stripeToken"]').val()
        };

        var submitButton = $('input[type="submit"]').button('loading');

        Meteor.call('createTrialCustomer', customer, function(error, response){
          if (error) {
            alert(error.reason);
            // If creation fails, make sure to "reset" our signup interface.
            submitButton.button('reset');
          } else {
            // Note: because we're using a Future to return a value, even if an error
            // occurs on the server, it will be passed back to the client as the
            // response argument. Here, we test to make sure we didn't receive an error
            // in our response before continuing.
            if ( response.error ) {
              alert(response.message);
              // If creation fails, make sure to "reset" our signup interface.
              submitButton.button('reset');
            } else {
              // Our user exists, so now we can log them in! Note: because we know
              // that we created our user using the emailAddress and password values
              // above, we can simply login with these :) Hot dog, indeed.
              Meteor.loginWithPassword(customer.emailAddress, customer.password, function(error){
                if (error) {
                  alert(error.reason);
                  // If login fails, make sure to "reset" our signup interface.
                  submitButton.button('reset');
                } else {
                  Router.go('/lists');
                  // If creation fails, make sure to "reset" our signup interface.
                  submitButton.button('reset');
                }
              });
            }
          }
        });

      }); // end STRIPE.getToken();
    }
  });
});

//stripe-checkout.js
if (Meteor.isClient) {
  Template.dash.events({
    'click #update': function(e) {
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
		}
  });
}