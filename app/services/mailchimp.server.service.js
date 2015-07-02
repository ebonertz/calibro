'use strict';

var MailchimpClient = require('../clients/mailchimp.server.client.js'),
	_ = require('lodash');

// Mailchimp services
// TODO: Check that the list exists before requesting

exports.isSubscribed = function(email, list, callback){
	console.log(email)

	MailchimpClient.getClient().lists.memberInfo({
		id: MailchimpClient.lists[list],
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

exports.subscribe = function(email, list, callback){
	var payload =	{
		"id": MailchimpClient.lists[list],
		"email": {
			"email": email
		},
		"update_existing": true,
	}
	MailchimpClient.getClient().lists.subscribe(payload,
		function(result){
			callback(null, result)
		},
		function(err){
			console.log(err)
			callback(err)
		}
	)
}

exports.unsubscribe = function(email, list, callback){
	MailchimpClient.getClient().lists.unsubscribe(
	{
		id: MailchimpClient.lists[list],
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
	var totalLists = MailchimpClient.lists.length;
	var count = 0;

	_.forEach(MailchimpClient.lists, function(listId, listName){
		MailchimpClient.getClient().lists.updateMember(
		{
			id: listId,
			email: {
				email: oldemail
			},
			merge_vars: {
				"new-email": newemail
			}
		},
		function(result){
			console.log("Updated member for "+listName)
			if(count >= totalLists -1){
				callback(null, result)
			}else{
				count++
			}
		},
		function(err){
			console.log("updateMember: "+listName)
			console.log(err)
			callback(err)
		})
	})
}
