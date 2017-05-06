import { Meteor } from 'meteor/meteor';
//import { Policies } from '../policies.js';

//var imageDetails = new Mongo.Collection('images');
let AWSID = Meteor.settings.AWSAccessKeyId;
let AWSSK = Meteor.settings.AWSSecretAccessKey;
let buck = Meteor.settings.bucket;
let ac = Meteor.settings.acl;
let reg = Meteor.settings.region;

Slingshot.fileRestrictions("myImageUploads", {
  allowedFileTypes: ["image/png", "image/jpeg", "application/pdf"],
  maxSize: 2 * 1024 * 1024,
});

Slingshot.createDirective("myImageUploads", Slingshot.S3Storage, {
  AWSAccessKeyId: AWSID,
  AWSSecretAccessKey: AWSSK,
  bucket: buck,
  acl: ac,
  //region: reg,

  authorize: function (file, metaContext) {
    let userDetail = Meteor.users.findOne({ _id: metaContext.userId });
    if (!userDetail) {
      var message = "Please login before posting images";
      throw new Meteor.Error("Login Required", message);
    }

    return true;
  },

  key: function (file, metaContext) {
  	 var user = Meteor.users.findOne({ _id: metaContext.userId });
    var currentUserId = user.emails ? user.emails[0].address : user.profile.email;
    return currentUserId + "/" + file.name;
  }

});