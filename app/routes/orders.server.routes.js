'use strict';

/**
 * Module dependencies.
 */
var commons = require('../controllers/commons.server.controller.js'),
    entity = 'orders';

module.exports = function (app) {
    app.route('/orders')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}));

    app.route('/orders/:id')
        .get(commons.byId.bind({entity: entity}));

    app.route('/orders/byCustomer/:customerId')
        .get(commons.byCustomer.bind({entity: entity}));
};
