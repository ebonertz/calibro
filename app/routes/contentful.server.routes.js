'use strict';

/**
 * Module dependencies.
 */
var contentful = require('../controllers/contentful.server.controller.js');

module.exports = function (app) {
    app.route('/contentful/home')
        .get(contentful.home);

    app.route('/contentful/eyewear')
        .get(contentful.eyewear);

    app.route('/contentful/summer/men')
        .get(contentful.menSummer);

    app.route('/contentful/summer/women')
        .get(contentful.womenSummer);
};
