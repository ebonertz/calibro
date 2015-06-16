'use strict';

/**
 * Module dependencies.
 */
var carts = require('../controllers/carts.server.controller.js'),
    commons = require('../controllers/commons.server.controller.js'),
    entity = 'carts';

module.exports = function (app) {
    app.route('/carts')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}))
        .delete(commons.deleteAll.bind({entity: entity}))

    app.route('/carts/:id')
        .get(commons.byId.bind({entity: entity}))
        .delete(commons.delete.bind({entity: entity}))

    app.route('/carts/byCustomer/:customerId')
        .get(commons.byCustomer.bind({entity: entity}));

    app.route('/carts/addLineItem/:cartId')
        .post(carts.addLineItem);

    app.route('/carts/removeLineItem/:cartId')
        .post(carts.removeLineItem);

    app.route('/carts/setShippingAddress/:cartId')
        .post(carts.setShippingAddress);

    app.route('/carts/setBillingAddress/:cartId')
        .post(carts.setBillingAddress);

    app.route('/carts/setShippingMethod/:cartId')
        .post(carts.setShippingMethod);

    app.route('/carts/changeLineItemQuantity/:cartId')
        .post(carts.changeLineItemQuantity);

    app.route('/carts/addDiscountCode/:cartId')
        .post(carts.addDiscountCode);

    app.route('/carts/createOrder/:cartId')
        .post(carts.createOrder);

};
