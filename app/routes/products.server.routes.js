'use strict';

/**
 * Module dependencies.
 */
var products = require('../controllers/products.server.controller.js'),
  commons = require('../controllers/commons.server.controller.js'),
  entity = 'products';

module.exports = function(app) {
  app.route('/api/products')
    .get(commons.list.bind({entity: entity}));

  // Products
  app.route('/api/products/categories/:categoryA')
      .post(products.listBy);
  app.route('/api/products/categories/:categoryA/:categoryB')
      .post(products.listBy);
  app.route('/api/products/id/:id').get(products.byId);
  app.route('/api/products/search/:text')
      .post(products.search);
  app.route('/api/products/:slug').get(products.bySlug);


};
