"use strict";

var CustomerService = require('../../services/sphere/sphere.customers.server.service.js');

var Customer = {};

Customer.findById = function(id, callback) {
  CustomerService.findOne(id, function(err, result){
    if(result){
      delete result.password 
    }
    callback(err, result)
  });
};

module.exports = Customer;
