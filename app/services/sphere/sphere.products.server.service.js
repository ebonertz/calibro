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

exports.searchByCategory = function(categoryId, requestParams, callback){
  var fetcher = SphereClient.getClient().productProjections
    .filterByQuery('categories.id:"'+categoryId+'"').facet('categories.id'); // Default byCategory

  //console.log(".filterByQuery('categories.id:\""+categoryId+"\"')")
  //console.log(".facet('categories.id')")

  // Query parameters
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

    var pageInfo = requestParams.getPageInfo()

    // Return products and facets
    var results = {
      products: products,
      facets: resultArray.body.facets,
      pages:{
        total: Math.ceil(resultArray.body.total / pageInfo.perPage),
        current: pageInfo.current,
        perPage: pageInfo.perPage
      }
    }
    callback(null, results);
  }).error(function(err) {
    console.log(err);
    callback(err, null);
  });
}

exports.searchByText = function(text, requestParams, callback){
  var fetcher = SphereClient.getClient().productProjections
      .text(text, 'en').facet('categories.id')

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

    var pageInfo = requestParams.getPageInfo()

    // Return products and facets
    var results = {
      products: products,
      facets: resultArray.body.facets,
      pages:{
        total: Math.ceil(resultArray.body.total / pageInfo.perPage),
        current: pageInfo.current,
        perPage: pageInfo.perPage
      }
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

exports.bySlug = function(slug, callback){
  SphereClient.getClient().productProjections.staged(false).where('slug(en = "'+slug+'")').fetch().then(function (result) {
    var product = new Product(result.body.results[0])
    callback(null, product);
  }).error(function(err){
    console.log(err)
    callback(err, null);
  })
}

exports.bySku = function(skuArray, callback){
  var query = 'variants.sku:';

  for(var i = 0; i < skuArray.length; i++) {
    if(i > 0)
      query += ',';

    query += '"' + skuArray[i] + '"';
  }
    console.log(query);

  SphereClient.getClient().productProjections.filterByQuery(query).search().then(function (result) {
      var products = result.body.results;
      for(var i = 0; i < products.length; i++){
          products[i] = new Product(products[i])
      }

      callback(null, products);
  }).error(function(err){
      console.log(err)
      callback(err, null);
  })
}
