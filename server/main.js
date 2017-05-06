// Server entry point, imports all server code
import { Meteor } from 'meteor/meteor';
import { Users } from "meteor/perak:user-roles";
import '/imports/startup/server';
import '/imports/startup/both';

Meteor.startup(() => {
    const verifyEmail = true;
    Accounts.config({
        sendVerificationEmail: verifyEmail,
        loginExpirationInDays: 7,
        //forbidClientAccountCreation: true
    });

    Accounts.urls.verifyEmail = token => Meteor.absoluteUrl(`verify_email/${token}`);
    Accounts.urls.resetPassword = (token) => {
        return Meteor.absoluteUrl('reset-password/' + token);
    };

    Accounts.onCreateUser((options, user) => {
        user.roles = ["user"];

        if (!user.services.facebook) {
            user.profile = options.profile;
            return user;
        }
        //user.username = user.services.facebook.name;
        user.emails = [{address: user.services.facebook.email}];
        return user;
    });

    Accounts.validateLoginAttempt(info => { //console.log(info);
        // reject user without verified e-mail address
        if (verifyEmail && info.user && info.user.emails && info.user.emails.length && !info.user.emails[0].verified) {
            //throw new Meteor.Error(499, "E-mail not verified.");
        }
        return true;
    });

    let fbId = Meteor.settings.private.oAuth.facebook.appId;
    let sec = Meteor.settings.private.oAuth.facebook.secret;

    ServiceConfiguration.configurations.remove({service: "facebook"});
    ServiceConfiguration.configurations.upsert({service: "facebook"}, {$set:{appId: fbId, secret: sec}});

    const MAIL_URL = Meteor.settings.env.MAIL_URL;
    if (MAIL_URL) {
        process.env["MAIL_URL"] = MAIL_URL;
    }

    Users.before.insert((userId, doc) => {
        if (doc.emails && doc.emails[0] && doc.emails[0].address) {
            doc.profile = doc.profile || {};
            doc.profile.email = doc.emails[0].address;
        } else {
            // oauth
            if (doc.services.facebook && doc.services.facebook.email) {
                doc.profile = doc.profile || {};
                doc.profile.email = doc.services.facebook.email;
            }
        }
    });

    //************************* cron job to notify Exp. cert/req start***************************//
    var CronJob = Npm.require('cron').CronJob;
    var job = new CronJob(
        '00 00 00 * * *',
        Meteor.bindEnvironment(() => {
            console.log('cron job started');
            Meteor.call('processPolicies');
            Meteor.call('processCertRequest');
        }),
        function () {
            //when job stop
        },
        false,  //Start the job right now
        'America/New_York' // Whatever timezone you want to set //America/Los_Angeles
    );
    job.start();
    //************************* cron job to notify Exp. cert end***************************//

    Router.route('/downloadAudit/:fileName',

        function () {
            var self = this;
            var fs = Npm.require("fs");
            let base = process.env.PWD +"/";
            //let fileDownloadPath = 'F:/glight_audit/'
            var file = fs.readFileSync(base + this.params.fileName);
            var headers = {
                'Content-Disposition': "attachment; filename=auditData.csv"
            };

            self.response.writeHead(200, headers);
            return self.response.end(file);

        }, {
            where: 'server'
        });

});