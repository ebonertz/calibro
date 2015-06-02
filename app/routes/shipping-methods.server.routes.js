'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    shippingMethods = require('../controllers/shipping-methods.server.controller.js');

module.exports = function (app) {
    app.route('/shipping-methods')
        .get(shippingMethods.list)
        .post(shippingMethods.create);

    app.route('/shipping-methods/:shippingMethodId')
        .get(shippingMethods.byId);

};
