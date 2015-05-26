var SphereClient = require('../../clients/sphere.server.client.js');

/**
 * List
 */
exports.list = function(callback) {
	SphereClient.getClient().products.all().fetch().then(function(resultArray) {
		callback(null, resultArray.body.results);
	}).error(function(err) {
		console.log(err);
		callback(err, null);
	});
};
