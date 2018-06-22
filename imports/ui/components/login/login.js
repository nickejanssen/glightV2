import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import '../../stylesheets/user/user.css';
import '../../stylesheets/loginButtons.css';
import './login.html';



Template.login.onCreated(function () {
    var _self = this;
    _self.pageSession = new ReactiveDict("");
});

Template.login.onRendered(() => {
  $('body').addClass("login-container");
});
Template.login.onDestroyed(() => { });

Template.login.helpers({
    errorMessage() {
        return Template.instance().pageSession.get("errorMessage");
    }
});

Template.login.events({
   "submit #login-form":(event,template) =>{
        event.preventDefault();
        let UserName=event.currentTarget.username.value.trim() , Password =event.currentTarget.password.value;
        let message=  _.isEmpty(UserName) ? "UserName is Required" :_.isEmpty(Password) ? "Password is Required" :"";
            if(_.isEmpty(message)){
                Meteor.loginWithPassword(UserName, Password, function(err,result) {
                    if (!err)
                    Router.go('/dash');
                    else{
                    template.pageSession.set("errorMessage", err.message);
                        return false;
                    }
                });
            }
        template.pageSession.set("errorMessage",message);
   },
	"click #login-with-facebook"(event, template) {
		event.preventDefault();
		template.pageSession.set("errorMessage", "");

		Meteor.loginWithFacebook(
			{
				requestPermissions: ['email', 'public_profile'],
				forceApprovalPrompt: true
			},
			function(err,res){
				if (err){
          template.pageSession.set("errorMessage", err.message);
          console.log(err.reason);
					return false;
				} else {
					const profile = Users.findOne().profile;
					//console.log(profile);
					profile['cname'] ? Router.go('/dash') : Router.go('/user-register')
				}
			}
		);
		return false;
	},
  'click .profile-image-login'(e,t){
    Router.go('/');
  }
});

Template.login.onDestroyed(function(){
  $('body').removeClass("login-container");
});
