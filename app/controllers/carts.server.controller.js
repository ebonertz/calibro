var CartService = require('../services/sphere/sphere.carts.server.service.js');


/**
 * List
 */
exports.list = function(req, res) {
	CartService.list(function(err, resultArray) {
		if (err) {
			return res.status(400);
		} else {
			res.json(resultArray);
		}
	});
};

exports.create = function (req, res) {
	var cart = req.body;

	CartService.create(cart, function (err, result) {
		if (err) {
			return res.status(400);
		} else {
			res.json(result);
		}
	});
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	next();
};
