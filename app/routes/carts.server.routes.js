'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	carts = require('../controllers/carts.server.controller.js');

module.exports = function(app) {
	app.route('/carts')
		.get(carts.list)
		.post(carts.create);

};
