'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
	config = require('../config/config');

// Initialize express app
var app = express();

/**
 * Configure the logger
 */

app.config = config;
app.logger = require('../config/logger')(app, config);

// var passport = require('../config/passport') (app);

// Return Express server instance
module.exports = app;
