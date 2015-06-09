'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  Product = require('../../models/sphere/sphere.product.server.model.js').Product,
  _ = require('lodash');

/**
 * List
 */
exports.list = function(callback) {
	SphereClient.getClient().productProjections.staged(false).fetch().then(function(resultArray) {
		callback(null, resultArray.body.results);
	}).error(function(err) {
		console.log(err);
		callback(err, null);
	});
};

exports.getByCategory = function(categoryId, requestParams, callback){
  var fetcher = SphereClient.getClient().productProjections
    .filterByQuery('categories.id:"'+categoryId+'"').facet('categories.id') // Default byCategory

  // Structure parameters
  // TODO: Move to RequestParameters object
  fetcher = requestParams.addByQueries(fetcher);
  fetcher = requestParams.addFilters(fetcher);
  fetcher = requestParams.addFacets(fetcher);
  fetcher = requestParams.addSorts(fetcher);
  fetcher = requestParams.addPaging(fetcher);

  fetcher.search().then(function(resultArray) {
    // Convert products
    var products = resultArray.body.results;
    for(var i = 0; i < products.length; i++){
      products[i] = new Product(products[i])
    }

    // Return products and facets
    var results = {
      products: products,
      facets: resultArray.body.facets
    }
    callback(null, results); 
  }).error(function(err) {
    console.log(err);
    callback(err, null);
  });
}


exports.byId = function(id, callback){
  SphereClient.getClient().productProjections.staged(false).byId(id).fetch().then(function (result) {
    var product = new Product(result.body)
    callback(null, product);
  }).error(function(err){
    console.log(err)
    callback(err, null);
  })
}