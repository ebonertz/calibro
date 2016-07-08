'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
    config = require('../../../config/config'),
    Promise = require('bluebird'),
  _ = require('lodash');


module.exports = function (app) {
  var  CategoriesService = require('./sphere.categories.server.service.js')(app),
      ChannelsService = require('./sphere.channels.server.service.js')(app);

  var Product = require('../../models/sphere/sphere.product.server.model.js')(app).Product;

  var service = {};

  /**
   * List
   */
  service.list = function(callback) {
    SphereClient.getClient().productProjections.staged(false).fetch().then(function(resultArray) {
      callback(null, resultArray.body.results);
    }).error(function(err) {
      app.logger.error ("Error listing products: %s",JSON.stringify(err));
      callback(err, null);
    });
  };

  service.listBy = function (categories, attributes, page, perPage, sortAttr, sortAsc) {

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
        if (_.isObject(attributes[attributeKeys[i]]) && _.isArray(attributes[attributeKeys[i]])) {
          _.each (attributes[attributeKeys[i]],function (attribute) {
            queryString +=  '"' + attribute + '",';
          });
          queryString = queryString.substring(0, queryString.length - 1);
        }
        else if (_.isObject(attributes[attributeKeys[i]]) && !attributes[attributeKeys[i]].isText) {
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

        var products = result.body.results;
        var cats = result.body.facets['categories.id'].terms;

        _.each(cats, function (item) {
          item.id = item.term;
          item.term = CategoriesService.getName(item.term);
        });
        _.each (products,function (product) {
          _.each (product.masterVariant.prices, function (price) {
            if (price.channel) {
              var channel = ChannelsService.getById(price.channel.id);
              price.channel = channel;
            }

          });
          if (product.masterVariant.isMatchingVariant === true) {
            product.displayVariant = product.masterVariant;
          }
          else {
            product.displayVariant = _.find (product.variants, function (variant) {
              return variant.isMatchingVariant === true
            });
          }

        });
        Promise.all(categoriesObjects).then(function (promises) {
          var results = {
            products: products,
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

  service.search = function (text, attributes, page, perPage, sortAttr, sortAsc) {

    return new Promise(function (resolve, reject) {

          var productClient = SphereClient.getClient().productProjections;
          productClient = productClient.text(text, 'en');

          for (var i = 0; i < config.sphere.facets.length; i++)
            productClient = productClient.facet(config.sphere.facets[i]);

          var attributeKeys = Object.keys(attributes);

          for (var i = 0; i < attributeKeys.length; i++) {
            var queryString = "";
            if (_.isObject(attributes[attributeKeys[i]]) && _.isArray(attributes[attributeKeys[i]])) {
              _.each (attributes[attributeKeys[i]],function (attribute) {
                queryString +=  '"' + attribute + '",';
              });
              queryString = queryString.substring(0, queryString.length - 1);
            }
            else if (_.isObject(attributes[attributeKeys[i]]) && !attributes[attributeKeys[i]].isText) {
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

          if (sortAttr != null) {
            productClient = productClient.sort(sortAttr, (sortAsc === "true"));
          }


          productClient.staged(config.sphere.staged).search().then(function (result) {

            var cats = result.body.facets['categories.id'].terms;

            _.each(cats, function (item) {
              item.id = item.term;
              item.term = CategoriesService.getName(item.term);
            });
            _.each (result.body.results,function (product) {
              if (product.masterVariant.isMatchingVariant === true) {
                product.displayVariant = product.masterVariant;
              }
              else {
                product.displayVariant = _.find (product.variants, function (variant) {
                  return variant.isMatchingVariant === true
                });
              }

            });

            var results = {
              products: result.body.results,
              facets: facetsShortener(result.body.facets),
              total: result.body.total,
              pages: {
                total: Math.ceil(result.body.total / perPage),
                page: page,
                perPage: perPage
              }
            }

            resolve(results)

          })

        }
    );
  };




  service.byId = function(id, callback){
    SphereClient.getClient().productProjections.staged(false).byId(id).fetch().then(function (result) {
      var product = new Product(result.body)
      callback(null, product);
    }).error(function(err){
      app.logger.error ("Error finding product by id. Error: %s",JSON.stringify(err));
      callback(err, null);
    })
  }

  service.bySlug = function(slug, callback){
    SphereClient.getClient().productProjections.staged(false).where('slug(en = "'+slug+'")').fetch().then(function (result) {
      var product = new Product(result.body.results[0])
      callback(null, product);
    }).error(function(err){
      app.logger.error ("Error finding product by slug Error: %s",JSON.stringify(err));
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

  service.bySlugWithFacets = function (slug) {
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


  service.bySku = function(skuArray, callback){
    var query = 'variants.sku:';

    for(var i = 0; i < skuArray.length; i++) {
      if(i > 0)
        query += ',';

      query += '"' + skuArray[i] + '"';
    }
    app.logger.debug("By sku query: %s",query);

    SphereClient.getClient().productProjections.filterByQuery(query).search().then(function (result) {
      var products = result.body.results;
      for(var i = 0; i < products.length; i++){
        products[i] = new Product(products[i])
      }

      callback(null, products);
    }).error(function(err){
      app.logger.error ("Error finding product by sku. Error: %s",JSON.stringify(err));
      callback(err, null);
    })
  }

  return service;
}
