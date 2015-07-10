'use strict';

/**
 * Module dependencies.
 */
var prescriptions = require('../controllers/prescriptions.server.controller.js');

module.exports = function (app) {
    app.route('/prescriptions/:cartId')
        .post(prescriptions.create)
        .get(prescriptions.byCart)
};
