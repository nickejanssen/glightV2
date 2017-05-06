import './profile_menu.html';

Template.profile_menu.events({
    'click .logout': (event) => {
        event.preventDefault();
        Meteor.logout();
        Router.go('/login');
    }
});