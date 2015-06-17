'use strict';

/**
 * Module dependencies.
 */
var products = require('../controllers/products.server.controller.js'),
  commons = require('../controllers/commons.server.controller.js'),
  entity = 'products';

module.exports = function(app) {
  app.route('/products')
    .get(commons.list.bind({entity: entity}));

  // Products
  app.route('/products/id/:id').get(products.byId);
  app.route('/products/:slug').get(products.bySlug);

  // Categories
  app.route('/categories/:slug').get(products.fetchCategoryProducts);
};
