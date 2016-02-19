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
  app.route('/api/products/id/:id').get(products.byId);
  app.route('/api/products/byText/:text').get(products.searchByText);
  app.route('/api/products/:slug').get(products.bySlug);

  // Categories
  app.route('/api/categories/:slug').get(products.fetchCategoryProducts);


};
