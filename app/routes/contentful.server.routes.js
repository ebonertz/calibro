'use strict';

module.exports = function(app) {
  var contentful = require('../controllers/contentful.server.controller.js')(app);

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

  // search by type and name
  app.route('/contentful/s/:type/:name')
    .get(contentful.byTypeAndName);

  app.route('/contentful/cache/clear')
    .post(contentful.clearCache);
};
