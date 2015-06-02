var ContentfulProductService = require('../services/contentful/contentful.products.server.service.js');


exports.listContentful = function(req, res) {
	ContentfulProductService.list(function(err, resultArray) {
		if (err) {
			return res.sendStatus(400);
		} else {
			res.json(resultArray);
		}
	});
};
