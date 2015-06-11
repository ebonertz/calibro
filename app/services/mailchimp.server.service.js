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
		var subscribed = result.data.length > 0 && result.data[0].status == "subscribed"
		callback(null, subscribed)
	}, function(err){
		console.log(err)
		callback(err)
	})
	
}

exports.subscribe = function(email, callback){
	MailchimpClient.getClient().lists.subscribe(
		{
			"id": MailchimpClient.listID,
			"email": {
				"email": email
			},
			"update_existing": true,
		},
		function(result){
			callback(null, result)
		},
		function(err){
			console.log(err)
			callback(err)
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
	function(err){
		console.log(err)
		callback(err)
	})
}

exports.updateMember = function(oldemail, newemail, callback){
	MailchimpClient.getClient().lists.updateMember(
	{
		id: MailchimpClient.listID,
		email: {
			email: oldemail
		},
		merge_vars: {
			"new-email": newemail
		}
	},
	function(result){
		callback(null, result)
	},
	function(err){
		console.log(err)
			callback(err)
	})
}