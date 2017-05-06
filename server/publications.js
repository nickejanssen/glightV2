Meteor.publish('userData', function () {
	let currentUser = Meteor.userId();
	if (currentUser) {
		return Meteor.users.find({}, {
			fields: {
				emails: 1,
				profile: 1,
			}
		});
	} else {
		console.log("Not Current User");
		return this.ready();
	}
});
