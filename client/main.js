// Client entry point, imports all client code
import '/imports/startup/client';
import '/imports/startup/both';

Meteor.startup(function () {
	//Begin Stripe Billing Logic//

	var stripeKey = Meteor.settings.private.stripe.publish;
	Stripe.setPublishableKey(stripeKey);

	/*STRIPE = {
			getToken: function( domElement, card, callback ) {
			Stripe.card.createToken( card, function( status, response ) {
					if ( response.error ) {
					Bert.alert( response.error.message, "danger" );
					} else {
					STRIPE.setToken( response.id, domElement, callback );
					}
			});
			},
			setToken: function( token, domElement, callback ) {
			$( domElement ).append( $( "<input type='hidden' name='stripeToken' />" ).val( token ) );
			callback();
			}
	};*/

	//End Stripe Billing Logic//
});