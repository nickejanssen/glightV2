import { Meteor } from 'meteor/meteor';
//import { Policies } from '../policies.js';

//var imageDetails = new Mongo.Collection('images');
let AWSID = Meteor.settings.AWSAccessKeyId;
let AWSSK = Meteor.settings.AWSSecretAccessKey;
let buck = Meteor.settings.bucket;
let ac = Meteor.settings.acl;
let reg = Meteor.settings.region;


Slingshot.fileRestrictions("myPolicyUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "image/pdf"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("myPolicyUploads", Slingshot.S3Storage, {
	//var AWSAccessKeyId = Meteor.settings.AWSAccessKeyId;

  AWSAccessKeyId: AWSID,
  AWSSecretAccessKey: AWSSK,
  bucket: buck,
  acl: ac,
  //region: reg,

  authorize: function () {
    // if (!this.userId) {
    //   var message = "Please login before posting images";
    //   throw new Meteor.Error("Login Required", message);
    // }

    return true;
  },

  key: function (file) {
    var currentUserId = Meteor.user().emails[0].address;
    return currentUserId + "/" + file.name;
  }

});