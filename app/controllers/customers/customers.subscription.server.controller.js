'use strict';

var MailchimpService = require('../../services/mailchimp.server.service.js');

// TODO add security

/*
 * Is subscribed
 */

exports.isSubscribed = function(req, res){
	var email = req.body.email
	MailchimpService.isSubscribed(email, function(err, result){
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
	var email = req.body.email
	MailchimpService.subscribe(email, function(err, result){
		if(err){
      return res.status(400).send(err);
		} else {
      res.json(result);
    }
	})
}

/*
 * Unsubscribe
 */

exports.unsubscribe = function (req, res) {
	var email = req.body.email
	MailchimpService.unsubscribe(email, function(err, result){
		if(err){
      return res.status(400).send(err);
		} else {
      res.json(result);
    }
	})
}
