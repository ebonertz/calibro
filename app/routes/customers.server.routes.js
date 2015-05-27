'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	customers = require('../controllers/customers.server.controller.js');

module.exports = function(app) {
	app.route('/customers')
		.get(customers.list)
		.post(customers.create);

	app.route('/customers/login')
		.post(customers.login);

  app.route('/customers/:id')
    .get(customers.findOne);

};
