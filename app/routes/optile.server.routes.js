'use strict';

/**
 * Module dependencies.
 */

module.exports = function (app) {
    var optile = require('../controllers/optile.server.controller.js')(app);

    app.route('/optile/list')
        .post(optile.list);

    app.route('/optile/return')
        .get(optile.return);

    app.route('/optile/cancel')
        .get(optile.cancel);

    app.route('/optile/notification')
        .get(optile.notification);

};
