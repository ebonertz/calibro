'use strict';

var MailchimpClient = require('../clients/mailchimp.server.client.js'),
	_ = require('lodash');

// Mailchimp services

module.exports = function (app) {
	var service = {};
	// TODO: Check that the list exists before requesting

	service.isSubscribed = function(email, list, callback){
		app.logger.debug("Check if it is subscribed: %s",email);

		MailchimpClient.getClient().lists.memberInfo({
			id: MailchimpClient.lists[list],
			emails: [{
				email: email
			}]
		}, function(result){
			var subscribed = result.data.length > 0 && result.data[0].status == "subscribed"
			callback(null, subscribed)
		}, function(err){
			app.logger.error("Error checking if user is subscribed %s",JSON.stringify(err));
			callback(err)
		})

	}

	service.subscribe = function(email, list, callback){
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
				app.logger.error("Error subscribing user: %s",JSON.stringify(err));
				callback(err)
			}
		)
	}

	service.unsubscribe = function(email, list, callback){
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
				app.logger.error("Error unsubscribing user: %s",JSON.stringify(err));
				callback(err)
			})
	}

	service.updateMember = function(oldemail, newemail, callback){
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
					app.logger.info("Updated member for %s",listName)
					if(count >= totalLists -1){
						callback(null, result)
					}else{
						count++
					}
				},
				function(err){
					app.logger.error("updateMember: %s ",listName)
					app.logger.error("Error updating member: %s",JSON.stringify(err));
					callback(err)
				})
		})
	}
	return service;
}

