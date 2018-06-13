import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import './add_co.html';

Template.add_co.helpers({

});

Template.add_co.events({
  'click #accSettings'(event) {
    event.preventDefault();
      Router.go('/dash');
      setTimeout(() => {
        $('.breadcrumb-elements li a.accSettings').trigger('click');
      }, 200)
  },
});
Template.add_co.onCreated(function () {

});

Template.add_co.onRendered(() => {
  // $('select').not('.disabled').material_select();

  $("form[name='formAddCompany']").bootstrapValidator({
    feedbackIcons: {
         valid: 'fa fa-check',
         invalid: 'fa fa-times',
         validating: 'fa fa-refresh'
     },
     fields: {
      Cname: {
        validators: {
          notEmpty: {
            message: 'The company name is required and can\'t be empty'
          },
        }
      },
      cfName: {
        validators: {
          notEmpty: {
            message: 'The First Name is required and can\'t be empty'
          },
        }
      },
      clName: {
        validators: {
          notEmpty: {
            message: 'The Last Name is required and can\'t be empty'
          },
        }
      },
      cphone: {
        validators: {
          integer: {
            message: 'The value is not an Number'
          },
          notEmpty: {
            message: 'The Phone Number is required and can\'t be empty'
          },
          stringLength: {
            message: 'Cell Phone must be 10 characters',
            min: 10,
            max: 10,
          },
          // regexp: {
          //   regexp: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
          //   message: 'Enter valid phone number'
          // }
        }
      },
      cemail: {
        validators: {
          notEmpty: {
            message: 'The email address is required and can\'t be empty'
          },
          regexp: {
            regexp: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            message: 'Enter valid email id'
          },
        }
      },
    }
  }).on('success.form.bv', (event) => {
    event.preventDefault();
    let AddCompany = {};

    AddCompany.companyName = event.currentTarget.Cname.value.trim();
    AddCompany.firstName = event.currentTarget.cfName.value.trim();
    AddCompany.lastName = event.currentTarget.clName.value.trim();
    AddCompany.companyEmail = event.currentTarget.cemail.value.trim();
    AddCompany.companyPhone = event.currentTarget.cphone.value.trim();
    //AddCompany.companyAgent = event.currentTarget.cAgent.value.trim();
    AddCompany.activeCerts = 0;
    AddCompany.waitingCerts = 0;
    AddCompany.expiredCerts = 0;
    AddCompany.userId = Meteor.userId();

    Meteor.call("AddNewCompany", AddCompany, (error, result) => {
      if(error){
        console.log(error.reason);
      } else {
        swal({
          title: "Company Added!",
          text: "Would you like to add another or go to your active companies?",
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#66BB6A",
          confirmButtonText: "Go to Active Companies",
          cancelButtonText: "Add Another",
          cancelButtonColor: "#26C6DA",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function(isConfirm){
          if (isConfirm) {
            document.getElementById("formAddCompany").reset();
            Meteor.call('addCompanyEmail', result);
            swal({
              title: "Going to Active Companies",
              text: "",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            });
            Router.go('/active');
          } else {
            document.getElementById("formAddCompany").reset();
            Meteor.call('addCompanyEmail', result);
            swal({
              title: "Awesome!",
              text: "Continue adding companies.",
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
      }
    });
  });
});
