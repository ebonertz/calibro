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

  app.route('/products/:id').get(products.byId);
  app.route('/categories/:slug').get(products.fetchCategoryProducts);

	app.route('/products/contentful')
		.get(products.listContentful);
};
