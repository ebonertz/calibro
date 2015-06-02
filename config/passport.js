'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	path = require('path'),
	config = require('./config'),
    CommonService = require('../app/services/sphere/sphere.commons.server.service.js');
	
/**
 * Module init function.
 */
module.exports = function() {
   // Serialize the user for the session
  passport.serializeUser(function(user, done) {
    console.log("Serializing "+user.email)
    done(null, user.id);
  });

  // Deserialize the user
  passport.deserializeUser(function(id, done) {
    console.log("Deserializing "+id)
    CommonService.byId('customers', id, function(err, customer){
      done(err, customer)
    });
  });

	// Initialize strategies
  // var strategyFiles = './config/strategies/**/*.js'
  var strategyFiles = './config/strategies/local.js'
	config.getGlobbedFiles(strategyFiles).forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};
