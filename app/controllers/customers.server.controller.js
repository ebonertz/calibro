'use strict';

/**
 * This file should only contain the export extend.
 * Nonetheless, it'll be used as a container while the users functionalities are ported to the customers'
 */

/**
 * Module dependencies.
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */

module.exports = function (app) {
  return _.extend(
      require('./customers/customers.authentication.server.controller')(app),
      require('./customers/customers.profile.server.controller')(app),
      require('./customers/customers.emails.server.controller')(app));
}
