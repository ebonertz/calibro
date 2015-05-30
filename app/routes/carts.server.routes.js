'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users.server.controller'),
    carts = require('../controllers/carts.server.controller.js');

module.exports = function (app) {
    app.route('/carts')
        .get(carts.list)
        .post(carts.create);

    app.route('/carts/:cartId')
        .get(carts.byId);

    app.route('/carts/addLineItem/:cartId')
        .post(carts.addLineItem);

    app.route('/carts/removeLineItem/:cartId')
        .post(carts.removeLineItem);

    app.route('/carts/byCustomer/:customerId')
        .get(carts.byCustomer);


};
