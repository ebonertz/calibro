'use strict';

/**
 * Module dependencies.
 */
var customers = require('../controllers/customers.server.controller.js');

module.exports = function(app) {
  // TODO: Disable list. Change findOne to me
	app.route('/customers')
    .put(customers.update)
    .get(customers.list);
  app.route('/customers/password').post(customers.changePassword);
  app.route('/customers/:id').get(customers.findOne);

  app.route('/auth/signup').post(customers.signup);
  app.route('/auth/signin').post(customers.signin);
  app.route('/auth/signout').get(customers.signout);
};
