'use strict';

/**
 * Module dependencies.
 */
var contentful = require('../controllers/contentful.server.controller.js');

module.exports = function (app) {
    app.route('/contentful/home')
        .get(contentful.home);

    app.route('/contentful/help')
      .get(contentful.help);

    app.route('/contentful/category/eyewear/:gender')
        .get(contentful.eyewear);

    app.route('/contentful/category/sunglasses/:gender')
        .get(contentful.sunglasses);

    app.route('/contentful/summer/men')
        .get(contentful.menSummer);

    app.route('/contentful/summer/women')
        .get(contentful.womenSummer);

    app.route('/contentful/byTypeAndName')
        .get(contentful.byTypeAndName);
};
