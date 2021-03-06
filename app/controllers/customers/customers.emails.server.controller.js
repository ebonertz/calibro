'use strict';



// TODO add security

module.exports = function (app) {
	var MailchimpService = require('../../services/mailchimp.server.service.js') (app),
		MandrillService = require('../../services/mandrill.server.service.js')(app);
	var controller = {};

	/*
	 * Is subscribed
	 */

	controller.isSubscribed = function (req, res) {
		var user = req.user;
		var list = req.params.listName;

		if (!user || !list)
			return res.status(400)

		var email = user.email
		MailchimpService.isSubscribed(email, list, function (err, result) {
			if (err) {
				return res.status(400).send(err);
			} else {
				res.json(result);
			}
		})
	}

	/*
	 * Subscribe
	 */

	controller.subscribe = function (req, res) {
		var user = req.user;
		var list = req.params.listName;

		if (!list)
			return res.status(400);

		var email;
		if (req.body.email)
			email = req.body.email
		else if (user['email'])
			email = user.email
		else
			return res.status(400);

		//var firstName = user['firstName']
		//var lastName = user['lastName']
		MailchimpService.subscribe(email, list, function (err, result) {
			if (err) {
				return res.status(400).send(err);
			} else {
				if (result.email && result.euid && result.leid)
					res.json(true);
				else
					res.json(false);
			}
		})
	}

	/*
	 * Unsubscribe
	 */

	controller.unsubscribe = function (req, res) {
		var user = req.user;
		var list = req.params.listName;

		if (!user || !list)
			return res.status(400)

		var email = user.email
		MailchimpService.unsubscribe(email, list, function (err, result) {
			if (err) {
				return res.status(400).send(err);
			} else {
				res.json(result);
			}
		})
	}

	controller.contactUs = function (req, res) {
		var email = req.body.email,
			name = req.body.name,
			message = req.body.message;

		MandrillService.contactUs(email, name, message).then(function (result) {
			return res.json({
				status: result[0].status
			})
		}, function (error) {
			return res.status(400).send(error)
		})
	}

	return controller;
};
