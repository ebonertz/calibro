'use strict';

var ProductService = require('../services/sphere/sphere.products.server.service.js'),
  CommonService = require('../services/sphere/sphere.commons.server.service'),
  CategoriesService = require('../services/sphere/sphere.categories.server.service'),
  RequestParameters = require('../services/sphere/request-parameters.server.service.js'),
  PostFilterService = require('../services/sphere/postfilters.server.service.js');

/**
 *  Product detail page
 */

exports.byId = function(req, res){
  var id = req.params.id

  if(!id)
    return res.status(400);

  ProductService.byId(id, function(err, result){
    if (err) {
      return res.status(400);
    } else {
      res.json(result);
    }
  })
}

exports.bySlug = function(req, res){
  var slug = req.params.slug

  if(!slug)
    return res.status(400)

  ProductService.bySlugWithFacets(slug).then(function (result) {
    res.json(result);
  }).error(function (err) {
    res.sendStatus(400);
  });

}

exports.fetchCategoryProducts = function(req,res){
  var slug = req.params.slug;

  if(!slug)
    return res.status(400);

  // TODO: Assign req.query to RequestParameters here to send to ProductService
  var params = new RequestParameters(req.query)

  // Fetch category
  var categoryId = CategoriesService.getId(slug)

  ProductService.searchByCategory(categoryId, params, function(err, result){
    if (err) {
      return res.status(400);
    } else {
      result.products = PostFilterService.variantDisplay(result.products, params);
      res.json(result);
    }
  })
}

exports.searchByText = function(req,res){
  var text = req.params.text;

  if(!text)
    return res.status(400);

  var params = new RequestParameters(req.query)

  ProductService.searchByText(text, params, function(err, result){
    if (err) {
      return res.status(400);
    } else {
      result.products = PostFilterService.variantDisplay(result.products, params);
      res.json(result);
    }
  })
}

exports.listBy = function (req, res) {
  var categoryA = req.params.categoryA,
      categoryB = req.params.categoryB,
      page = req.query.page,
      perPage = req.query.perPage,
      sortAttr = req.query.sortAttr,
      sortAsc = req.query.sortAsc;


  var categoryAId = null,
      categoryBId = null,
      attributes = req.body;

  var categories = [];

  if (categoryA) {
    categoryAId = CategoriesService.getId(categoryA);
    if (categoryAId)
      categories.push(categoryAId);
    else {
      res.sendStatus(400);
      return;
    }
  }

  if (categoryB) {
    categoryBId = CategoriesService.getId(categoryB);
    if (categoryAId)
      categories.push(categoryBId);
    else {
      res.sendStatus(400);
      return;
    }
  }

  ProductService.listBy(categories, attributes, page, perPage, sortAttr, sortAsc).then(function (result) {
    res.json(result);
  });
}

