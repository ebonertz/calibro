'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
	var logger = require('../../app/controllers/logger.server.controller')(app);

	// Browser exception logging
	app.route('/api/log').post(logger.logError);

	app.route('/*').get(core.index);
};
