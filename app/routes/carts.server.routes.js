'use strict';

/**
 * Module dependencies.
 */
var entity = 'carts';

module.exports = function (app) {
    var commons = require('../controllers/commons.server.controller.js')(app),
        carts = require('../controllers/carts.server.controller.js')(app);
    app.route('/api/carts')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}))
        .delete(commons.deleteAll.bind({entity: entity}))

    app.route('/api/carts/init')
        .get(carts.init);

    app.route('/api/carts/refreshCart')
        .get(carts.refreshCart);

    app.route('/api/carts/cartEyewearPrescriptionCount')
        .get(carts.cartEyewearPrescriptionCount);

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

    app.route('/api/carts/blueblock/:cartId/:version')
        .post(carts.addBlueBlock);

    app.route('/api/carts/removeBlueBlock/:cartId/:version')
        .post(carts.removeBlueBlock);

};
