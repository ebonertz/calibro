'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	path = require('path'),
	config = require('./config');
/**
 * Module init function.
 */
module.exports = function(app) {

  var CommonService = require('../app/services/sphere/sphere.commons.server.service.js')(app);

  // Serialize the user for the session
  passport.serializeUser(function(user, done) {
    app.logger.debug("Serializing "+user.email)
    done(null, user.id);
  });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    app.logger.debug("Deserializing "+id)
    CommonService.byId('customers', id, function(err, customer){
      done(err, customer)
    });
  });

	// Initialize strategies
  // var strategyFiles = './config/strategies/**/*.js'
  var strategyFiles = './config/strategies/local.js'
	config.getGlobbedFiles(strategyFiles).forEach(function(strategy) {
		require(path.resolve(strategy))(app);
	});
  return passport;
};
