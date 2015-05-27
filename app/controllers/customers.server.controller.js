'use strict';

/**
 * This file should only contain the export extend.
 * Nonetheless, it'll be used as a container while the users functionalities are ported to the customers'
 */

/**
 * Module dependencies.
 */
var _ = require('lodash');

var CustomerService = require('../services/sphere/sphere.customers.server.service.js');
var User = require('../models/sphere/sphere.customer.server.model.js');

/**
 * List
 */
 exports.list = function (req, res) {
  CustomerService.list(function (err, resultArray) {
    if (err) {
      return res.status(400);
    }

    return res.json(resultArray);
  });
};


exports.findOne = function(req, res){
  var id;

  id = req.params.id;

  User.findById(id, function(err, result){
    if (err) {
      return res.status(400);
    } else {
      // res.json(result);
      if(result && result !== 'undefined')
        return res.json(result);
      else
        return res.status(503);
    }
  });
}

/**
 *  authorization middleware
 */
 exports.hasAuthorization = function (req, res, next) {
  next();
};

/**
 * Extend user's controller
 */

module.exports = _.extend(
  require('./customers/customers.authentication.server.controller')
);
