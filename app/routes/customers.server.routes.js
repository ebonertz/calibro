'use strict';

/**
 * Module dependencies.
 */
var entity = 'customers';

module.exports = function(app) {
   var customers = require('../controllers/customers.server.controller.js')(app),
        commons = require('../controllers/commons.server.controller.js')(app);

    app.route('/api/addresses').post(customers.addAddress)
    app.route('/api/addresses/:id')
        .put(customers.updateAddress)
        .delete(customers.deleteAddress);

  // TODO: Disable list. Change findOne to me
	app.route('/api/customers')
    .put(customers.update)
    .get(commons.list.bind({entity: entity}));

  app.route('/api/customers/password-token').post(customers.resetPasswordEmail);
  app.route('/api/customers/password/reset').post(customers.requestPasswordReset);

  app.route('/api/customers/password/update').put(customers.changePassword);
  app.route('/api/customers/:id').get(commons.byId.bind({entity: entity}));

  app.route('/api/auth/signup').post(customers.signup);
  app.route('/api/auth/signin').post(customers.signin);
  app.route('/api/auth/signout').get(customers.signout);
  app.route('/api/auth/token').post(customers.signWithToken);

  app.route('/api/subscribe/:listName').post(customers.subscribe);
  app.route('/api/unsubscribe/:listName').post(customers.unsubscribe);
  app.route('/api/issubscribed/:listName').get(customers.isSubscribed);

  app.route('/api/contactUs/').post(customers.contactUs);
};
