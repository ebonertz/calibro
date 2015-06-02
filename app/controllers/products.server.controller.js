'use strict';

var ProductService = require('../services/sphere/sphere.products.server.service.js'),
	ContentfulProductService = require('../services/contentful/contentful.products.server.service.js');


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
		return res.status(404);

	ProductService.byId(id, function(err, result){
		if (err) {
			return res.status(400);
		} else {
			res.json(result);
		}
	})
}