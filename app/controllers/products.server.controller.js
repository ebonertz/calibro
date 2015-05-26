var ProductService = require('../services/products.sphere.server.service.js');


/**
 * List
 */
exports.list = function(req, res) {
	ProductService.list(function(err, resultArray) {
		if (err) {
			return res.status(400);
		} else {
			res.json(resultArray);
		}
	});
};


/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
