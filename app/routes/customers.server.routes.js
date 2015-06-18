'use strict';

/**
 * Module dependencies.
 */
var customers = require('../controllers/customers.server.controller.js'),
    commons = require('../controllers/commons.server.controller.js'),
    entity = 'customers';

module.exports = function(app) {
  // TODO: Disable list. Change findOne to me
	app.route('/customers')
    .put(customers.update)
    .get(commons.list.bind({entity: entity}));

  app.route('/customers/password-token').post(customers.resetPasswordEmail);
  app.route('/customers/password/reset').post(customers.requestPasswordReset);

  app.route('/customers/password/update').put(customers.changePassword);
  app.route('/customers/:id').get(commons.byId.bind({entity: entity}));

  app.route('/auth/signup').post(customers.signup);
  app.route('/auth/signin').post(customers.signin);
  app.route('/auth/signout').get(customers.signout);

  app.route('/addresses').post(customers.addAddress)
  app.route('/addresses/:id')
    .put(customers.updateAddress)
    .delete(customers.deleteAddress);

  app.route('/subscribe/:listName').post(customers.subscribe);
  app.route('/unsubscribe/:listName').post(customers.unsubscribe);
  app.route('/issubscribed/:listName').get(customers.isSubscribed);

  app.route('/contactUs/').post(customers.contactUs);
};
