'use strict';

/**
 * Module dependencies.
 */
var commons = require('../controllers/commons.server.controller.js'),
    orders = require('../controllers/orders.server.controller.js'),
    entity = 'orders';

module.exports = function (app) {
    app.route('/api/orders')
        .get(commons.list.bind({entity: entity}))
        .post(orders.create);

    app.route('/api/orders/own')
    	.get(commons.byCustomerOwn.bind({entity: entity}));

    app.route('/api/orders/:id')
        .get(commons.byId.bind({entity: entity}));

    app.route('/api/orders/byCustomer/:customerId')
        .get(commons.byCustomer.bind({entity: entity}));

    app.route('/api/orders/fromPaypal/:cartId')
        .get(orders.fromPaypal);

    // TODO: Should be deleted when merge.
    app.route('/api/orders/payOrder/:orderId')
        .post(orders.payOrder);


};
