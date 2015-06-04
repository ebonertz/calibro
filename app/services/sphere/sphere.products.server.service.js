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

exports.getByCategory = function(categoryId, params, callback){
  var fetcher = SphereClient.getClient().productProjections.filterByQuery('categories.id:"'+categoryId+'"')

  // Structure parameters
  // TODO: Move to RequestParameters object
  if(params){
    _.forEach(params, function(value, key){
      var query = filterKeys[key]+':"'+value.toUpperCase().split(";").join('","')+'"'
      fetcher = fetcher.filter(query)
    })
  }

  fetcher.search().then(function(resultArray) {
    var results = resultArray.body.results;
    for(var i = 0; i < results.length; i++){
      results[i] = new Product(results[i])
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

// TODO: Move to RequestParameters object (sphere-specific)
var filterKeys = {
  sex: "variants.attributes.sex.key"
}