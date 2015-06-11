'use strict';

var MailchimpClient = require('../clients/mailchimp.server.client.js')

// Mailchimp services

exports.isSubscribed = function(email, callback){
	console.log(email)
	MailchimpClient.getClient().lists.memberInfo({
		id: MailchimpClient.listID,
		emails: [{
			email: email
		}]
	}, function(result){
		var subscribed = result.data[0].status == "subscribed"
		callback(null, subscribed)
	}, function(err){
		console.log(err)
		callback(err)
	})
	
}

exports.subscribe = function(email, callback){
	MailchimpClient.getClient().lists.subscribe(
		{
			id: MailchimpClient.listID,
			email: {
				email: email
			}
		},
		function(result){
			callback(null, result)
		},
		function(error){
			console.log(error)
		}
	)
}

exports.unsubscribe = function(email, callback){
	MailchimpClient.getClient().lists.unsubscribe(
		{
			id: MailchimpClient.listID,
			email: {
				email: email
			}
		},
		function(result){
			callback(null, result)
		},
		function(error){
			console.log(error)
		}
	)
}