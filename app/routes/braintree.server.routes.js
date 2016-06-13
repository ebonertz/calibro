'use strict';

/**
 * Module dependencies.
 */

module.exports = function (app) {
  var braintree = require('../controllers/braintree.server.controller.js')(app);

  app.route('/braintree/clientToken')
    .get(braintree.clientToken);

  app.route('/braintree/checkout')
    .post(braintree.checkout);
//
//    app.route('/paypal/settle')
//        .get(braintree.settle);
//    
//    app.route('/paypal/void')
//        .get(braintree.void);

};
