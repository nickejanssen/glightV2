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
          //console.log("Success! ", downloadUrl);
          //console.log('uploaded file available here: '+downloadUrl);

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
          if (Router.current()
            .route.getName() == "App.upload_cert_public") {
            let req_certData = RequestCertificate.findOne();
            AddPolicy.userId = req_certData.userId;
            AddPolicy.uploadedBy = req_certData.userId + "_req_cert";
            AddPolicy.reqCertID = req_certData._id;
          }
          if (Session.get('policyID')) {
            AddPolicy.policyID = Session.get('policyID');
          }
          AddPolicy.coverageInfo = $('#' + Session.get('currentCov')).serializeObject();
          debugger;
          Meteor.call("AddNewPolicy", AddPolicy, (error, result) => {
            if (error) {
              console.log(error.reason);
            } else {
              //console.log("Policy Added");
              swal("Success!", "Your policy has been uploaded.", "success");
              document.getElementById("formAddCert").reset();
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
});

Template.upload_cert.onDestroyed(() => { });
