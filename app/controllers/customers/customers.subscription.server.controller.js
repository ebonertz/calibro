'use strict';

var MailchimpService = require('../../services/mailchimp.server.service.js');

// TODO add security

/*
 * Is subscribed
 */

exports.isSubscribed = function(req, res){
	var user = req.user;
	var list = req.params.listName;

	if(!user || !list)
		return res.status(400)

	var email = user.email
	MailchimpService.isSubscribed(email, list, function(err, result){
		if(err){
		return res.status(400).send(err);
		} else {
	  res.json(result);
	  }
	})
}

/*
 * Subscribe
 */

exports.subscribe = function (req, res) {
	var user = req.user;
	var list = req.params.listName;

	if(!user || !list)
		return res.status(400)

	var email = user.email
	var firstName = user.firstName
	var lastName = user.lastName
	MailchimpService.subscribe(email, list, function(err, result){
		if(err){
	  	return res.status(400).send(err);
		} else {
			if(result.email && result.euid && result.leid)
	  		res.json(true);
	  	else
	  		res.json(false);
		}
	})
}

/*
 * Unsubscribe
 */

exports.unsubscribe = function (req, res) {
	var user = req.user;
	var list = req.params.listName;

	if(!user || !list)
		return res.status(400)

	var email = user.email
	MailchimpService.unsubscribe(email, list, function(err, result){
		if(err){
	  		return res.status(400).send(err);
		} else {
	  		res.json(result);
		}
	})
}
