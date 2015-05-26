var ContenfulClient = require('../../clients/contenful.server.client.js');

/**
 * List
 */
exports.list = function(callback) {
	ContenfulClient.getClient().entries({}, function(err, entries) {
		if(err) {
			callback(err, null);
		} else {
			callback(null, entries);
		}
	});
};
