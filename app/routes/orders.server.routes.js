'use strict';

/**
 * Module dependencies.
 */
var commons = require('../controllers/commons.server.controller.js'),
    orders = require('../controllers/orders.server.controller.js'),
    entity = 'orders';

module.exports = function (app) {
    app.route('/orders')
        .get(commons.list.bind({entity: entity}))
        .post(orders.create);

    app.route('/orders/own')
    	.get(commons.byCustomerOwn.bind({entity: entity}));

    app.route('/orders/:id')
        .get(commons.byId.bind({entity: entity}));

    app.route('/orders/byCustomer/:customerId')
        .get(commons.byCustomer.bind({entity: entity}));

    app.route('/orders/payOrder/:orderId')
        .post(orders.payOrder);


};
