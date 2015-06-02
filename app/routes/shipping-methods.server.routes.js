'use strict';

/**
 * Module dependencies.
 */
var commons = require('../controllers/commons.server.controller.js'),
    entity = 'shippingMethods';

module.exports = function (app) {
    app.route('/shipping-methods')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}));

    app.route('/shipping-methods/:id')
        .get(commons.byId.bind({entity: entity}));

};
