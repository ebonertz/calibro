'use strict';

/**
 * Module dependencies.
 */
var contentful = require('../controllers/contentful.server.controller.js');

module.exports = function (app) {
    app.route('/contentful/home')
        .get(contentful.home);
};
