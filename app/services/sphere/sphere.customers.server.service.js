'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  Customer = require('../../models/sphere/sphere.customer.server.model.js');

/**
 * List
 */

exports.create = function (customer, callback) {
    SphereClient.getClient().customers.create(customer).then(function (result) {
      var customer = new Customer(result.body.customer)
      callback(null, customer);
    }).error(function (err) {
      console.log(err);
      callback(err, null);
    });
};

exports.login = function (username, password, callback) {
    var customer = {
        "email": username,
        "password": password
    };

    SphereClient.getClient().authentication.save(customer).then(function (result) {
      var customer = new Customer(result.body.customer)
      callback(null, customer);
    }).error(function (err) {
      console.log(err);
      callback(err, null);
    });
};

/**
 * Find
 */

exports.list = function (callback) {
  SphereClient.getClient().customers.all().fetch().then(function (resultArray) {
    callback(null, resultArray.body.results);
  }).error(function (err) {
    console.log(err);
    callback(err, null);
  });
};

exports.findOne = function(id, callback){
  SphereClient.getClient().customers.byId(id).fetch().then(function (result){
    delete result.body.password 
    var customer = new Customer(result.body);
    callback(null, customer);
  })
  .error(function (err) {
    console.log(err);
    callback(err, null);
  });
};