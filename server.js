'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
	config = require('./config/config'),
	mongoose = require('mongoose'),
	chalk = require('chalk'),
  session = require('express-session'),
  flash = require('connect-flash'),
  passport = require('passport');


/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

	
// Bootstrap db connection
/*var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});*/

// Init the express application
var app = require('./config/express')(null);

// PhantomJS
require('./config/phantom')();

// Bootstrap passport config
require('./config/passport')(app);

// Start the app by listening on <port>
app.listen(config.port);

// Expose app
exports = module.exports = app;

// Logging initialization
app.logger.info('Focali application started on port ' + config.port);


