'use strict';

/**
 * Module dependencies.
 */
var authorizeNet = require('../controllers/authorize-net.server.controller.js');

module.exports = function (app) {
    app.route('/authorize-net/get')
        .get(authorizeNet.get);
};