import { Meteor } from 'meteor/meteor';

import '../../ui/layouts/body/body.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/archp/arch.js';
import '../../ui/pages/activep/active.js';
import '../../ui/pages/addCo/addCo.js';
import '../../ui/pages/addAgent/addAgent.js';
import '../../ui/pages/coDetail/coDetail.js';
import '../../ui/pages/docUploads/docUploads.js';
import '../../ui/pages/docUploads/docUpload.js';
import '../../ui/pages/contact/contact.js';
import '../../ui/pages/user-login/user-login.js';
import '../../ui/pages/user-register/user-register.js';
import '../../ui/pages/forget-password/forget-password.js';
import '../../ui/pages/reset-password/reset-password.js';
import '../../ui/pages/user-profile/user-profile.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/loader/loading.js';
import '../../ui/pages/audit/audit.js';
import '../../ui/pages/request_cert/request_cert.js';
import '../../ui/pages/request_cert_update/request_cert_update.js';
import '../../ui/pages/landingp/landingp.js';
import '../../ui/pages/verify_email/verify_email.js';

Router.configure({
	layoutTemplate: "App_body",
	loadingTemplate: 'loading',
	notFoundTemplate: "App_notFound",
	waitOn: function () {
		Meteor.subscribe("current_user_data")
	}
});

function loginrequired() {
	if (!Meteor.userId()) {
		// user is not logged in - redirect to public home
		Router.go("App.landing");
	} else {
		// if (Meteor.userId() && !routeGranted(this.route.getName())) {
		// 	Router.go("App.home");
		// }
		// else {
		// 	this.next();
		// }
	}
	this.next();
};

if (Meteor.isClient) {
	Router.onBeforeAction(loginrequired, {
		except: [
			"App.landing",
			"App.user_register",
			"App.forgot_password",
			'App.reset_password',
			"App.user_login",
			"App.contact",
			"App.verify_email",
			"App.upload_cert_public"
		]
	});

}

const publicRouteNames = [
	"App.landing",
	"App.user_register",
	"App.forgot_password",
	"App.user_login",
	"App.contact",
	"App.verify_email",
	"App.upload_cert",
	"App.upload_cert_pub"
];

const privateRouteNames = [
	"App.home",
	"App.arch",
	"App.active",
	"App.audit",
	"App.req-cert",
	"App.req-cert-update",
	"App.user_profile",
	"App.add_co",
	"App.add_agent",
	"App.co_detail",
	"App.upload_cert"
];

const freeRouteNames = [

];

const roleMap = [
	{ route: "App.home", roles: ["user", "admin"] },
	{ route: "App.arch", roles: ["user", "admin"] },
	{ route: "App.active", roles: ["user", "admin"] },
	{ route: "App.audit", roles: ["user", "admin"] },
	{ route: "App.req-cert", roles: ["user", "admin"] },
	{ route: "App.req-cert-update", roles: ["user", "admin"] },
	{ route: "App.user_profile", roles: ["user", "admin"] },
	{ route: "App.add_co", roles: ["user", "admin"] },
	{ route: "App.add_agent", roles: ["user", "admin"] },
	{ route: "App.co_detail", roles: ["user", "admin"] },
	{ route: "App.upload_cert", roles: ["user", "admin"] }
];

const firstGrantedRoute = preferredRoute => {
	if (preferredRoute && routeGranted(preferredRoute)) return preferredRoute;

	let grantedRoute = "";

	_.every(privateRouteNames, route => {
		if (routeGranted(route)) {
			grantedRoute = route;
			return false;
		}
		return true;

	});

	if (grantedRoute) return grantedRoute;

	_.every(publicRouteNames, route => {
		if (routeGranted(route)) {
			grantedRoute = route;
			return false;
		}

		return true;
	});

	if (grantedRoute) return grantedRoute;

	_.every(freeRouteNames, route => {
		if (routeGranted(route)) {
			grantedRoute = route;
			return false;
		}

		return true;
	});

	if (grantedRoute) return grantedRoute;

	if (!grantedRoute) {
		console.log("All routes are restricted for current user.");
		return "notFound";
	}

	return "";
};

// this function returns true if user is in role allowed to access given route
export const routeGranted = routeName => {
	if (!routeName) {
		// route without name - enable access (?)
		return true;
	}

	if (!roleMap || roleMap.length === 0) {
		// this app doesn't have role map - enable access
		return true;
	}

	const roleMapItem = _.find(roleMap, roleItem => roleItem.route == routeName);

	if (!roleMapItem) {
		// page is not restricted
		return true;
	}

	if (!Meteor.user() || !Meteor.user().roles) {
		// user is not logged in or doesn't have "role" member
		return false;
	}

	// this page is restricted to some role(s), check if user is in one of allowedRoles
	const allowedRoles = roleMapItem.roles;
	const granted = _.intersection(allowedRoles, Meteor.user().roles);
	if (!granted || granted.length === 0) {
		return false;
	}

	return true;
};

Router.map(function () {
	this.route('App.landing', {
		path: '/',
		template: 'landingp',
		fastRender: true,
		layoutTemplate: false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.home', {
		path: '/dash',
		template: 'App_home',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('archp', {
		path: '/arch',
		template: 'archp',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('activep', {
		path: '/active',
		template: 'activep',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.audit', {
		path: '/audit',
		template: 'audit_page',
		fastRender: true,
		waitOn: function () {
			return [Meteor.subscribe("AllCompanies")]
		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.req-cert', {
		path: '/req-cert',
		template: 'request_cert',
		fastRender: true,
		waitOn: function () {
			return Meteor.subscribe("AllActiveCompanies");;
		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.req-cert-update', {
		path: '/req-cert-update/:policyID',
		template: 'request_cert_update',
		fastRender: true,
		waitOn: function () {
			return Meteor.subscribe("AllActiveCompanies");;
		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.user_register', {
		path: '/user-register',
		template: 'user_register',
		fastRender: true,
		layoutTemplate : false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.forgot_password', {
		path: '/forgot-password',
		template: 'forgot-password',
		fastRender: true,
		layoutTemplate : false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.reset_password', {
		path: '/reset-password/:resetPassToken',
		template: 'reset-password',
		fastRender: true,
		layoutTemplate : false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});


	this.route('App.user_profile', {
		path: '/profile',
		template: 'user-profile',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.user_login', {
		path: '/login',
		template: 'user_login',
		fastRender: true,
		layoutTemplate : false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.add_co', {
		path: '/add-co',
		template: 'Add_co',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.add_agent', {
		path: '/add-agent',
		template: 'Add_agent',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.co_detail', {
		path: '/co-detail/:companyId',
		template: 'Co_detail',
		fastRender: true,
		waitOn: function () {
			return [Meteor.subscribe("getCompanyDetails", this.params.companyId), Meteor.subscribe("AllPolicies", this.params.companyId), Meteor.subscribe("requested_cert_byComp", this.params.companyId)]
		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.upload_cert_public', {
		path: '/upload_cert_request/:docId',
		template: 'doc-uploads',
		fastRender: true,
		waitOn: function () {
			return Meteor.subscribe("getCompanyDetailsFromRequest", this.params.docId);
		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.upload_cert', {
		path: '/upload_cert',
		template: 'doc-upload',
		fastRender: true,
		waitOn: function () {
			return Meteor.subscribe("AllActiveCompanies");
		},
		onBeforeAction: function () {
			this.next()
		},
		onAfterAction: function () {
		}
	});


	this.route('App.contact', {
		path: '/help',
		template: 'contact',
		fastRender: true,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});

	this.route('App.verify_email', {
		path: '/verify_email/:verifyEmailToken',
		template: 'VerifyEmail',
		fastRender: true,
		layoutTemplate : false,
		waitOn: function () {

		},
		onBeforeAction: function () {
			this.next();
		},
		onAfterAction: function () {
		}
	});
});
