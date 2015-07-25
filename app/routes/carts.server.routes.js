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

    app.route('/carts/init')
        .get(carts.init);

    app.route('/carts/:id')
        .get(carts.byId)
        .delete(commons.delete.bind({entity: entity}))

    app.route('/carts/byCustomer/:customerId')
        .get(carts.byCustomer);

    app.route('/carts/addLineItem/:cartId/:version')
        .post(carts.addLineItem);

    app.route('/carts/removeLineItem/:cartId/:version')
        .post(carts.removeLineItem);

    app.route('/carts/setShippingAddress/:cartId/:version')
        .post(carts.setShippingAddress);

    app.route('/carts/setBillingAddress/:cartId/:version')
        .post(carts.setBillingAddress);

    app.route('/carts/setShippingMethod/:cartId/:version')
        .post(carts.setShippingMethod);

    app.route('/carts/changeLineItemQuantity/:cartId/:version')
        .post(carts.changeLineItemQuantity);

    app.route('/carts/addDiscountCode/:cartId/:version')
        .post(carts.addDiscountCode);

    app.route('/carts/highIndex/:cartId/:version')
        .post(carts.addHighIndex);

    app.route('/carts/removeHighIndex/:cartId/:version')
        .post(carts.removeHighIndex);
};
