'use strict';

var config = require('../../config/config'),
	mandrill = require('node-mandrill')(config.mandrill.key);

exports.mandrill = mandrill;
exports.options = config.mandrill.options;
exports.templates = config.mandrill.templates;