import { Template } from 'meteor/templating';
import '../../stylesheets/dropify/css/dropify.min.css';
import '../../stylesheets/dropify/js/dropify.min.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Company } from '../../../api/company/company.js';
import { Policies } from '../../../api/policies/policies.js';
import { RequestCertificate } from '/imports/api/req_certificate/req_certificate.js';
import { Session } from 'meteor/session';
import { coverageType } from '/imports/api/constant.js';
import './upload_cert.html';
//IMPORT COVERAGE TEMPLATES
import './coverages/genliability/genLiability.js';
import './coverages/workComp/workComp.js';
import './coverages/umbrella/umbrella.js';
import './coverages/autoLiability/autoLiability.js';
import './coverages/epc/epc.js';
import './coverages/blank/blank.js';


var uploader = new ReactiveVar();
var currentUserId = Meteor.userId();


Template.upload_cert.onCreated(function () {
  let _self = this;
  _self.policyDetail = new ReactiveDict();
  _self.companyDetail = new ReactiveDict();
  _self.agentDetail = new ReactiveDict();

  Tracker.autorun(() => { });

});

Template.upload_cert.events({
  'submit #formAddCert': function (event, template) {
    event.preventDefault();
    var metaContext = {};
    if (Router.current()
      .route.getName() == "App.upload_cert_public") {
      let req_certData = RequestCertificate.findOne();
      var metaContext = {
        userId: req_certData.userId
      }
    } else {
      var metaContext = {
        userId: Meteor.userId()
      }
    }
    var upload = new Slingshot.Upload("myImageUploads", metaContext);
    let timeStamp = new Date();

    upload.send(document.getElementById('uploadFile').files[0],
      function (error, downloadUrl) {
        uploader.set();

        if (error) {
          console.error('Error uploading');
          alert(error);
        } else {
          let AddPolicy = {};

          AddPolicy.userId = Meteor.userId();
          AddPolicy.companyId = event.currentTarget.certComp.value.trim();
          AddPolicy.agentId = event.currentTarget.certAgent.value.trim();
          AddPolicy.policyName = event.currentTarget.pname.value.trim();
          AddPolicy.uploadDate = timeStamp;
          AddPolicy.startDate = event.currentTarget.startDate.valueAsDate;
          AddPolicy.expDate = event.currentTarget.expiryDate.valueAsDate;
          AddPolicy.policyStatus = "received";
          AddPolicy.uApproved = false;
          AddPolicy.coverage = event.currentTarget.certCove.value.trim();
          AddPolicy.imageurl = downloadUrl;
          AddPolicy.uploadedBy = Meteor.userId();
          console.log(AddPolicy);
          if (Router.current().route.getName() == "App.upload_cert_public") {
            let req_certData = RequestCertificate.findOne();
            AddPolicy.userId = req_certData.userId;
            AddPolicy.uploadedBy = req_certData.userId + "_req_cert";
            AddPolicy.reqCertID = req_certData._id;
          }
          if (Session.get('policyID')) {
            AddPolicy.policyID = Session.get('policyID');
          }
          AddPolicy.coverageInfo = $('#' + Session.get('currentCov')).serializeObject();
          //debugger;
          Meteor.call("AddNewPolicy", AddPolicy, (error, result) => {
            if (error) {
              console.log(error.reason);
            } else {
              swal("Success!", "Your policy has been uploaded.", "success");
              document.getElementById("formAddCert").reset();
              Meteor.call('certUploaded',result);
              Router.go('/co-detail/' + AddPolicy.companyId);
            }
          });
        }

      });
    uploader.set(upload);
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

Template.upload_cert.helpers({
  chooseCov: function () {
    var name = Session.get('currentCov');
    console.log(name);
    Meteor.setTimeout(function () {
      // $('select').not('.disabled').material_select();
      // $('select multiple').not('.disabled').material_select();
    }, 20);
    if (name) {
      return { template: Template[name] };
    } else {
      return;
    }
  },
  isUploading: function () {
    return Boolean(uploader.get());
  },
  progress: function () {
    var upload = uploader.get();
    if (upload)
      return Math.round(upload.progress() * 100);
  },
  AllCompanies: function () {
    //debugger;
    if (Router.current()
      .route.getName() != "App.upload_cert_public") {
      return Company.find({
        userId: Meteor.userId(),
        archived: false
      });
    } else {
      return Company.find({});
    }
  },
  getCoverageType: function () {
    return coverageType;
  }
});

Template.upload_cert.onRendered(() => {
  //Session.set('currentCov', false)
  // $('select').not('.disabled').material_select();
  // $('select multiple').not('.disabled').material_select();
$('.select').select2();
  if (Router.current()
    .route.getName() == "App.upload_cert_public") {
    let req_certData = RequestCertificate.findOne();
    $('#certComp').val(req_certData.companyID);
    $('#certCov').val(req_certData.coverage);
  } else {
    $('#certComp').val(Session.get('compID'));
  }

  $('.dropify-fr')
    .dropify({
      messages: {
        default: 'Glissez-déposez un fichier ici ou cliquez',
        replace: 'Glissez-déposez un fichier ou cliquez pour remplacer',
        remove: 'Supprimer',
        error: 'Désolé, le fichier trop volumineux'
      }
    });
  // Used events
  var drEvent = $('.dropify-event')
    .dropify();
  drEvent.on('dropify.beforeClear', function (event, element) {
    return confirm("Do you really want to delete \"" + element.filename + "\" ?");
  });
  drEvent.on('dropify.afterClear', function (event, element) {
    alert('File deleted');
  });

  $("#formAddCert").bootstrapValidator({
    feedbackIcons: {
         valid: 'fa fa-check',
         invalid: 'fa fa-times',
         validating: 'fa fa-refresh'
     },
     fields: {
       pname: {
         validators: {
           notEmpty: {
             message: 'Policy Name is required and can\'t be empty'
           },
         }
       },
       certAgent: {
         validators: {
           notEmpty: {
             message: 'Uploading Agent is required and can\'t be empty'
           },
         }
       },
       startDate: {
            validators: {
                date: {
                    format: 'DD/MM/YYYY',
                    message: 'The value is not a valid date'
                },
                notEmpty: {
                  message: 'startDate is required and can\'t be empty'
                },
            }
        },
        expiryDate: {
            validators: {
                date: {
                    format: 'DD/MM/YYYY',
                    message: 'The value is not a valid date'
                },
                notEmpty: {
                  message: 'expiryDate is required and can\'t be empty'
                },
            }
        },
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
       medPay1: {
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
       covAmt: {
         validators: {
           notEmpty: {
             message: 'Coverage Amount is required and can\'t be empty'
           },
         }
       },
       val: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Damage to Rented Premise'
            },
           notEmpty: {
             message: 'Valuation is required and can\'t be empty'
           },
         }
       },
       coIns: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Co-Insurance'
            },
           notEmpty: {
             message: 'Co-Insurance is required and can\'t be empty'
           },
         }
       },
       perils: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Perils'
            },
           notEmpty: {
             message: 'Perils is required and can\'t be empty'
           },
         }
       },
       av: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Agreed Value'
            },
           notEmpty: {
             message: 'Agreed Value is required and can\'t be empty'
           },
         }
       },
       blanket: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Blanket'
            },
           notEmpty: {
             message: 'Blanket is required and can\'t be empty'
           },
         }
       },
       flood: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Flood'
            },
           notEmpty: {
             message: 'Flood is required and can\'t be empty'
           },
         }
       },
       earth: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Earthquake'
            },
           notEmpty: {
             message: 'Earthquake is required and can\'t be empty'
           },
         }
       },
       eqpBreak: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Equipment Breakdown'
            },
           notEmpty: {
             message: 'Equipment Breakdown is required and can\'t be empty'
           },
         }
       },
       deduct: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Deductible'
            },
           notEmpty: {
             message: 'Deductible is required and can\'t be empty'
           },
         }
       },
       end: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Endorsements'
            },
           notEmpty: {
             message: 'Endorsements is required and can\'t be empty'
           },
         }
       },
       polType: {
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
       aggrApplPer: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Aggregate Applied Per'
            },
           notEmpty: {
             message: 'Aggregate Applied Per is required and can\'t be empty'
           },
         }
       },
       genAgg: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose General Aggregate'
            },
           notEmpty: {
             message: 'General Aggregate is required and can\'t be empty'
           },
         }
       },
       proAgg: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Products Aggregate'
            },
           notEmpty: {
             message: 'Products Aggregate is required and can\'t be empty'
           },
         }
       },
       Occurence: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Occurence'
            },
           notEmpty: {
             message: 'Occurence is required and can\'t be empty'
           },
         }
       },
       perAdvert: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Personal Advertising'
            },
           notEmpty: {
             message: 'Personal Advertising is required and can\'t be empty'
           },
         }
       },
       deductible: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Deductible'
            },
           notEmpty: {
             message: 'Deductible is required and can\'t be empty'
           },
         }
       },
       dedAppTo: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose  Ded. Applies To'
            },
           notEmpty: {
             message: ' Ded. Applies To is required and can\'t be empty'
           },
         }
       },
       appPer: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Applied Per'
            },
           notEmpty: {
             message: 'Applied Per is required and can\'t be empty'
           },
         }
       },
       occur: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Occurence'
            },
           notEmpty: {
             message: 'Occurence is required and can\'t be empty'
           },
         }
       },
       agg: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Aggregate'
            },
           notEmpty: {
             message: 'Aggregate is required and can\'t be empty'
           },
         }
       },
       empLiLim: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Employer\'s Liability Limit'
            },
           notEmpty: {
             message: 'Employer\'s Liability Limit is required and can\'t be empty'
           },
         }
       },
       aggDeduct: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Aggregate Deductible'
            },
           notEmpty: {
             message: 'Aggregate Deductible is required and can\'t be empty'
           },
         }
       },
       appTo: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Applies To'
            },
           notEmpty: {
             message: 'Applies To is required and can\'t be empty'
           },
         }
       },
       stat: {
         validators: {
           choice: {
                min: 1,
                max: 1,
                message: 'Please choose Statutory'
            },
           notEmpty: {
             message: 'Statutory is required and can\'t be empty'
           },
         }
       },
       other: {
         validators: {
           notEmpty: {
             message: 'Other is required and can\'t be empty'
           },
         }
       },

     }
   });
});

Template.upload_cert.onDestroyed(() => { });
