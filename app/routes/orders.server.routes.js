'use strict';

/**
 * Module dependencies.
 */
var entity = 'orders';

module.exports = function (app) {
    var orders = require('../controllers/orders.server.controller.js')(app);

    var commons = require('../controllers/commons.server.controller.js')(app);

    app.route('/api/orders')
        .get(commons.list.bind({entity: entity}))
        .post(orders.create);

    app.route('/api/orders/own')
        .get(commons.byCustomerOwn.bind({entity: entity}));

    app.route('/api/orders/:id')
        .get(orders.byId.bind({entity: entity}));

    app.route('/api/orders/byCustomer/:customerId')
        .get(commons.byCustomer.bind({entity: entity}));


};
