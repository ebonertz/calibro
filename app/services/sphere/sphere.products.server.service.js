'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  Product = require('../../models/sphere/sphere.product.server.model.js').Product,
    CategoriesService = require('./sphere.categories.server.service.js'),
    ChannelsService = require('./sphere.channels.server.service.js'),
    config = require('../../../config/config'),
    Promise = require('bluebird'),
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

exports.listBy = function (categories, attributes, page, perPage, sortAttr, sortAsc) {

  return new Promise(function (resolve, reject) {

    var productClient = SphereClient.getClient().productProjections,
        categoriesObjects = [];

    for (var i = 0; i < config.sphere.facets.length; i++)
      productClient = productClient.facet(config.sphere.facets[i]);

    for (var i = 0; i < categories.length; i++) {
      productClient = productClient.filterByQuery('categories.id:"' + categories[i] + '"');
      categoriesObjects.push(CategoriesService.getCategoryById(categories[i]));
    }

    var attributeKeys = Object.keys(attributes);

    for (var i = 0; i < attributeKeys.length; i++) {
      var queryString = "";
      if (_.isObject(attributes[attributeKeys[i]]) && !attributes[attributeKeys[i]].isText) {
        queryString = attributes[attributeKeys[i]].value;
      }
      else {
        queryString = '"' + attributes[attributeKeys[i]] + '"';
      }
      productClient = productClient.filterByQuery(config.sphere.product_types[attributeKeys[i]] + ':' + queryString);
    }
    if (page)
      productClient = productClient.page(parseInt(page));

    if (perPage)
      productClient = productClient.perPage(parseInt(perPage));

    if (sortAttr)
      productClient = productClient.sort(sortAttr, (sortAsc === "true"));

    productClient.staged(false).search().then(function (result) {

      var cats = result.body.facets['categories.id'].terms;

      _.each(cats, function (item) {
        item.id = item.term;
        item.term = CategoriesService.getName(item.term);
      });
      Promise.all(categoriesObjects).then(function (promises) {
        var results = {
          products: result.body.results,
          facets: facetsShortener(result.body.facets),
          pages: {
            total: Math.ceil(result.body.total / perPage),
            page: page,
            perPage: perPage
          },
          total: result.body.total,
          categories: promises
        }

        resolve(results)
      });


    });
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


    var pageInfo = requestParams.getPageInfo();

    _.each (products,function (product) {
      _.each (product.masterVariant.prices, function (price) {
        if (price.channel) {
          var channel = ChannelsService.getById(price.channel.id);
          price.channel = channel;
        }

      });
    });

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


var facetsShortener = function (facets, variantsLength) {
  var result = {};

  var keys = Object.keys(facets);

  for (var i = 0; i < keys.length; i++) {
    var shortName = config.sphere.product_types_inv[keys[i]],
        terms = facets[keys[i]].terms;

    if (variantsLength != null && terms.length == 1 && terms[0].term == "" && terms[0].count == variantsLength)
      continue;
    else
      result[shortName] = terms;

  }

  return result;


}

exports.bySlugWithFacets = function (slug) {
  var productClient = SphereClient.getClient().productProjections;
  productClient = productClient.filterByQuery('slug.en:"' + slug + '"');

  return productClient.staged(false).expand('productType').search().then(function (result) {
    if (result.body.results[0])
      return result.body.results[0];
    else
      return Promise.reject(new Error('Product not found.'));
  }).then(function (product) {

    var productClient = SphereClient.getClient().productProjections,
        productClient = productClient.filterByQuery('slug.en:"' + slug + '"'),
        typeAttributes = product.productType.obj.attributes;

    _.each(typeAttributes, function (attribute) {
      if (attribute.attributeConstraint == 'CombinationUnique')
        productClient = productClient.facet(config.sphere.product_types[attribute.name]);
    });


    return productClient.staged(false).expand('productType').expand('categories[*]').search().then(function (result) {
      //populate channel
      var masterVariant = result.body.results[0].masterVariant;
      _.each (masterVariant.prices, function (price) {
        if(price.channel) {
          var channel = ChannelsService.getById(price.channel.id);
          price.channel = channel;
        }
      });

      var results = {
        product: result.body.results[0],
        channels: ChannelsService.listChannels(),
        facets: facetsShortener(result.body.facets, result.body.results[0].variants.length + 1)
      }
      return results;
    });
  });
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
