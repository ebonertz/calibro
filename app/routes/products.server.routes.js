'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
	products = require('../controllers/products.server.controller.js');

module.exports = function(app) {
	app.route('/products')
		.get(products.list);

};
