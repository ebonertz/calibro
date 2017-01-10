'use strict';

/**
 * Module dependencies.
 */
var multiparty = require('connect-multiparty'),
    multipartyMiddleware = multiparty()
//    fileupload = require('fileupload').createFileUpload('/uploadDir').middleware

module.exports = function (app) {
    var prescriptions = require('../controllers/prescriptions.server.controller.js')(app);
    app.route('/prescriptions/upload').post(prescriptions.upload)

    app.route('/prescriptions/:cartId')
        .post(prescriptions.create)
        .get(prescriptions.byCart);
};
