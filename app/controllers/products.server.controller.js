'use strict';

var ProductService = require('../services/sphere/sphere.products.server.service.js'),
	ContentfulProductService = require('../services/contentful/contentful.products.server.service.js'),
	CommonService = require('../services/sphere/sphere.commons.server.service'),
	CategoriesService = require('../services/sphere/sphere.categories.server.service'),
	RequestParameters = require('../services/sphere/request-parameters.server.service.js'),
	PostFilterService = require('../services/sphere/postfilters.server.service.js');


exports.listContentful = function(req, res) {
	ContentfulProductService.list(function(err, resultArray) {
		if (err) {
			return res.sendStatus(400);
		} else {
			res.json(resultArray);
		}
	});
};

/**
 *	Product detail page
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

exports.fetchCategoryProducts = function(req,res){
	var slug = req.params.slug;

	if(!slug)
		return res.status(400);

	// TODO: Assign req.query to RequestParameters here to send to ProductService
	var params = new RequestParameters(req.query)

	// Fetch category
	new Promise(function(resolve, reject){
		CategoriesService.getId(slug, function(err, resultId){
			if(err){
				return res.status(400).send({message: err.message})
			}else{
				resolve(resultId)
			}
		})
  })
  
	// Fetch products
  .then(function(categoryId){
		ProductService.getByCategory(categoryId, params, function(err, result){
			if (err) {
				return res.status(400);
			} else {
				result.products = PostFilterService.variantDisplay(result.products, params);
				res.json(result);
			}
		})
	})
}