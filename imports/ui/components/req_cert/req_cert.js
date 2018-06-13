import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { coverageType } from '/imports/api/constant.js';
import './req_cert.html';
import '../../stylesheets/dropify/css/dropify.min.css';

let coEmail;

Template.req_cert.onCreated(function () {
  let _self = this;
  _self.companyDetail = new ReactiveDict();
  Tracker.autorun(() => {
    //Find Companies
    let _Companies = Company.find({});
    _self.companyDetail.set("AllCompanies", _Companies.fetch());

  });
});

Template.req_cert.helpers({
  AllCompanies() {
    let _CompanyDetail = Template.instance().companyDetail.get("AllCompanies");
    return _CompanyDetail;
  },
  getCoverageType: function () {
    return coverageType;
  },
  chooseCov: function () {
    var name = Session.get('currentCov');
    console.log(name);
    Meteor.setTimeout(function () {}, 20);
    if (name) {
      return { template: Template[name] };
    } else {
      return;
    }
  }
});

Template.req_cert.onRendered(()=>{
  //formValidate ....
  $("#formRequestCertificte").bootstrapValidator({
    feedbackIcons: {
         valid: 'fa fa-check',
         invalid: 'fa fa-times',
         validating: 'fa fa-refresh'
     },
     fields: {
       certComp: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose company to request from'
            },
           notEmpty: {
             message: 'Company to request is required and can\'t be empty'
           },
         }
       },
       certCove: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Coverage'
            },
           notEmpty: {
             message: 'Coverage is required and can\'t be empty'
           },
         }
       },
       covType: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Policy Type'
            },
           notEmpty: {
             message: 'Policy Type is required and can\'t be empty'
           },
         }
       },
       limType: {
         validators: {
           choice: {
                min: 1,
                message: 'Please choose Limits Types'
            },
           notEmpty: {
             message: 'Limits Types is required and can\'t be empty'
           },
         }
       },
       combLim: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Combined Single Limits'
            },
           notEmpty: {
             message: 'Combined Single Limits is required and can\'t be empty'
           },
         }
       },
       medPay: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Medical Payments'
            },
           notEmpty: {
             message: 'Medical Payments is required and can\'t be empty'
           },
         }
       },
       perPer: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Per Person'
            },
           notEmpty: {
             message: 'Per Person is required and can\'t be empty'
           },
         }
       },
       perAcc: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Per Accident'
            },
           notEmpty: {
             message: 'Per Accident is required and can\'t be empty'
           },
         }
       },
       dmgPremise: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Damage to Rented Premise'
            },
           notEmpty: {
             message: 'Damage to Rented Premise is required and can\'t be empty'
           },
         }
       },


     }
   }).on('success.form.bv', (e,t) => {
     debugger
     e.preventDefault();
     let formEmail = t.$('#cemail').val();
       var email;
       if (coEmail !== formEmail) {
         email = formEmail
       } else {
         email = coEmail
       }

       let selectedCo = t.$('#certComp').val();
       let reqCompany = Company.findOne({ _id: selectedCo });
       const userId = Meteor.userId();
       const company = selectedCo;
       const cname = reqCompany.companyName;
       const coverage = e.currentTarget.certCove.value.trim();
       const coverageInfo = $('#' + Session.get('currentCov')).serializeObject();
       console.log(coverageInfo);
       Meteor.call('req_certificate.insert', { email: coEmail, coverage: coverage, coverageInfo:coverageInfo, companyID: company, coName: cname, type: "New Upload" }, (error, result) => {
         if (error) {
           alert(error);
         } else {
           Meteor.call("sendMail", email, result);
           swal({
             title: "Request Sent!",
             text: "Would you like to request another or go to your review your policies on the audit page?",
             type: "success",
             showCancelButton: true,
             confirmButtonColor: "#66BB6A",
             confirmButtonText: "Go to Policies",
             cancelButtonText: "Request Another",
             cancelButtonColor: "#26C6DA",
             closeOnConfirm: false,
             closeOnCancel: false
           },
           function(isConfirm){
             if (isConfirm) {
               document.getElementById("formRequestCertificte").reset();
               swal({
                 title: "Going to Policies",
                 text: "",
                 type: "success",
                 timer: 2000,
                 showConfirmButton: false
               });
               Router.go('/audit');
             } else {
               swal({
                 title: "Awesome!",
                 text: "Continue requesting",
                 timer: 1500,
                 showConfirmButton: false
               });
             }
           });
           document.getElementById("formRequestCertificte").reset();
         }
       });
   });
})
Template.req_cert.events({
  'click #settingsTab'(event) {
    event.preventDefault();
      Router.go('/dash');
      setTimeout(() => {
        $('.breadcrumb-elements li a.accSettings').trigger('click');
      }, 200)
  },
  "change #certComp": function (event) {
    debugger;
    let selectedCo = $(event.target).val();
    let reqCompany = Company.findOne({ _id: selectedCo });
    coEmail = reqCompany.companyEmail;
    $('label[id*="lemail"]').text('');
    $("#cemail").val(coEmail);
  },

  'submit #formValidate'(e, t) {
    e.preventDefault();
    let formEmail = t.$('#cemail').val();
    var email;
    if (coEmail !== formEmail) {
      email = formEmail
    } else {
      email = coEmail
    }

    let selectedCo = t.$('#certComp').val();
    let reqCompany = Company.findOne({ _id: selectedCo });
    const userId = Meteor.userId();
    const company = selectedCo;
    const cname = reqCompany.companyName;
    const coverage = e.currentTarget.certCove.value.trim();
    debugger
    const coverageInfo = $('#' + Session.get('currentCov')).serializeObject();
    console.log(coverageInfo);
    Meteor.call('req_certificate.insert', { email: coEmail, coverage: coverage, coverageInfo:coverageInfo, companyID: company, coName: cname, type: "New Upload" }, (error, result) => {
      if (error) {
        alert(error);
      } else {
        Meteor.call("sendMail", email, result);
        swal({
          title: "Request Sent!",
          text: "Would you like to request another or go to your review your policies on the audit page?",
          type: "success",
          showCancelButton: true,
          confirmButtonColor: "#66BB6A",
          confirmButtonText: "Go to Policies",
          cancelButtonText: "Request Another",
          cancelButtonColor: "#26C6DA",
          closeOnConfirm: false,
          closeOnCancel: false
        },
        function(isConfirm){
          if (isConfirm) {
            document.getElementById("formAddCompany").reset();
            swal({
              title: "Going to Policies",
              text: "",
              type: "success",
              timer: 2000,
              showConfirmButton: false
            });
            Router.go('/audit');
          } else {
            swal({
              title: "Awesome!",
              text: "Continue requesting",
              timer: 1500,
              showConfirmButton: false
            });
          }
        });
        document.getElementById("formValidate").reset();
      }
    });
  },

  'click #btnAddCo'(e, t) {
    Router.go('/add-co');
  },

  "change #certCov": function (event) {
    let selectedCov = $(event.target).val();
    console.log("Triggered");
    if (selectedCov == "autoLiability") {
      Session.set('currentCov', "autoLiability");
    } else if (selectedCov == "evidProp") {
      Session.set('currentCov', "epc");
    } else if (selectedCov == "umbrella") {
      Session.set('currentCov', "umbrella");
    } else if (selectedCov == "genLiability") {
      Session.set('currentCov', "genLiability");
    } else if (selectedCov == "workComp") {
      Session.set('currentCov', "workComp");
    } else {
      Session.set('currentCov', "blank");
    }
  }
});



Template.req_cert.onRendered(() => {
  //$('.multiselect').select2();
  $('.panel [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#fff',
              opacity: 0.8,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #ddd'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });


  // Sidebar categories
  $('.category-title [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#000',
              opacity: 0.5,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #000'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none',
              color: '#fff'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });
  $('.sidebar-default .category-title [data-action=reload]').click(function (e) {
      e.preventDefault();
      var block = $(this).parent().parent().parent().parent();
      $(block).block({
          message: '<i class="icon-spinner2 spinner"></i>',
          overlayCSS: {
              backgroundColor: '#fff',
              opacity: 0.8,
              cursor: 'wait',
              'box-shadow': '0 0 0 1px #ddd'
          },
          css: {
              border: 0,
              padding: 0,
              backgroundColor: 'none'
          }
      });

      // For demo purposes
      window.setTimeout(function () {
         $(block).unblock();
      }, 2000);
  });

  $('.category-collapsed').children('.category-content').hide();
  $('.category-collapsed').find('[data-action=collapse]').addClass('rotate-180');
  $('.category-title [data-action=collapse]').click(function (e) {
      e.preventDefault();
      var $categoryCollapse = $(this).parent().parent().parent().nextAll();
      $(this).parents('.category-title').toggleClass('category-collapsed');
      $(this).toggleClass('rotate-180');

      containerHeight(); // adjust page height

      $categoryCollapse.slideToggle(150);
  });
  $('.panel-collapsed').children('.panel-heading').nextAll().hide();
  $('.panel-collapsed').find('[data-action=collapse]').addClass('rotate-180');
  $('.panel [data-action=collapse]').click(function (e) {
      e.preventDefault();
      var $panelCollapse = $(this).parent().parent().parent().parent().nextAll();
      $(this).parents('.panel').toggleClass('panel-collapsed');
      $(this).toggleClass('rotate-180');

      containerHeight(); // recalculate page height

      $panelCollapse.slideToggle(150);
  });

  $('.select').select2();
  $(".multiselect").select2({
      placeholder: "Click here to select coverages."
    });
});
