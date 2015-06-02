'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    orders = require('../controllers/orders.server.controller.js');

module.exports = function (app) {
    app.route('/orders')
        .get(orders.list)
        .post(orders.create);

    app.route('/orders/:orderId')
        .get(orders.byId);

    app.route('/orders/byCustomer/:customerId')
        .get(orders.byCustomer);


};
