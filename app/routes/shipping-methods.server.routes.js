'use strict';

/**
 * Module dependencies.
 */
var shippingMethods = require('../controllers/shipping-methods.server.controller.js'),
    commons = require('../controllers/commons.server.controller.js'),
    entity = 'shippingMethods';

module.exports = function (app) {
    app.route('/shipping-methods')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}));

    app.route('/shipping-methods/byLocation')
        .get(shippingMethods.byLocation);

    app.route('/shipping-methods/byLocationOneCurrency')
        .get(shippingMethods.byLocationOneCurrency);

    app.route('/shipping-methods/byCart/:cartId')
        .get(shippingMethods.byCart);

    app.route('/shipping-methods/:id')
        .get(commons.byId.bind({entity: entity}));


};
