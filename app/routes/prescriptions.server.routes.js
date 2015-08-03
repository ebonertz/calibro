'use strict';

/**
 * Module dependencies.
 */
var prescriptions = require('../controllers/prescriptions.server.controller.js'),
    multiparty = require('connect-multiparty'),
    prefix = '/prescriptions/',
    multipartyMiddleware = multiparty()
//    fileupload = require('fileupload').createFileUpload('/uploadDir').middleware

module.exports = function (app) {
    app.route(prefix+'upload').post(prescriptions.upload)

    app.route(prefix+':cartId')
        .post(prescriptions.create)
        .get(prescriptions.byCart);
};
