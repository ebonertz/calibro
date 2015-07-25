'use strict';

/**
 * Module dependencies.
 */
var paypal = require('../controllers/paypal.server.controller.js');

module.exports = function (app) {

    app.route('/paypal/setExpressCheckout')
        .get(paypal.setExpressCheckout);

    app.route('/paypal/success')
        .get(paypal.success);

    app.route('/paypal/cancel')
        .get(paypal.cancel);
};
