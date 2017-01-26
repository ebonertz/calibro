'use strict';

module.exports = function(app) {
  var contentful = require('../controllers/contentful.server.controller.js')(app);

  app.route('/contentful/help')
    .get(contentful.help);

  app.route('/contentful/summer/men')
    .get(contentful.menSummer);

  app.route('/contentful/summer/women')
    .get(contentful.womenSummer);

  app.route('/contentful/v/:slug')
    .get(contentful.getView);

  app.route('/contentful/cache/clear')
    .post(contentful.clearCache);
};
