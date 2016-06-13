'use strict';

/**
 * Module dependencies.
 */
var carts = require('../controllers/carts.server.controller.js'),
    commons = require('../controllers/commons.server.controller.js'),
    entity = 'carts';

module.exports = function (app) {
    app.route('/api/carts')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}))
        .delete(commons.deleteAll.bind({entity: entity}))

    app.route('/api/carts/init')
        .get(carts.init);

    app.route('/api/carts/:cartId')
        .get(carts.byId)
        .delete(commons.delete.bind({entity: entity}))

    app.route('/api/carts/byCustomer/:customerId')
        .get(carts.byCustomer);

    app.route('/api/carts/addLineItem/:cartId/:version')
        .post(carts.addLineItem);

    app.route('/api/carts/removeLineItem/:cartId/:version')
        .post(carts.removeLineItem);

    app.route('/api/carts/setShippingAddress/:cartId')
        .post(carts.setShippingAddress);

    app.route('/api/carts/setBillingAddress/:cartId')
        .post(carts.setBillingAddress);

    app.route('/api/carts/setShippingMethod/:cartId')
        .post(carts.setShippingMethod);

    app.route('/api/carts/changeLineItemQuantity/:cartId/:version')
        .post(carts.changeLineItemQuantity);

    app.route('/api/carts/addDiscountCode/:cartId/:version')
        .post(carts.addDiscountCode);

    app.route('/api/carts/highIndex/:cartId/:version')
        .post(carts.addHighIndex);

    app.route('/api/carts/removeHighIndex/:cartId/:version')
        .post(carts.removeHighIndex);
};
