'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller'),
  CustomerService = require('../../services/sphere/sphere.customers.server.service.js');

/**
 * List
 */
 exports.list = function (req, res) {
  CustomerService.list(function (err, resultArray) {
    if (err) {
      return res.sendStatus(400);
    }

    return res.json(resultArray);
  });
};

exports.findOne = function(req, res){
  var id;

  id = req.params.id;

  CustomerService.findOne(id, function(err, customer){
    if (err) {
      return res.status(400).send();
    } else {
      if(customer)
        return res.json(customer);
      else
        return res.status(503).send();
    }
  });
}
