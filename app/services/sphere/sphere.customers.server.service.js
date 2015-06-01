'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  Customer = require('../../models/sphere/sphere.customer.server.model.js'),
  _ = require('lodash');

var updateCustomer = function(customer_id, actions){
  return SphereClient.getClient().customers.byId(customer_id).update(actions)
}

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

exports.login = function (email, password, anonymousCartId, callback) {
    var customer = {
        "email": email,
        "password": password,
        "anonymousCartId": anonymousCartId
    };

    console.log("anonymousCartId " + anonymousCartId)

    SphereClient.getClient().authentication.save(customer).then(function (result) {
      var customer = new Customer(result.body.customer)
      callback(null, customer, result.body.cart);
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

/**
 * Update
 */

exports.updateProfile = function(customer, updateValues, callback){
  var actions = {
    version: customer.version,
    actions: []
  }

  if(updateValues.firstName || updateValues.lastName){
    var changeName = {action: 'changeName'}
    changeName.firstName = updateValues.firstName ? updateValues.firstName : customer.firstName;
    changeName.lastName = updateValues.lastName ? updateValues.lastName : customer.lastName;
    actions.actions.push(changeName)
  }

  if(updateValues.email){
    actions.actions.push({
      action: 'changeEmail',
      email: updateValues.email
    })
  }

  if(actions.actions.length < 1){
    callback(new Error("No values to update."), null)
  } else {
    console.log("Updating "+customer.email+", version "+customer.version)
    SphereClient.getClient().customers.byId(customer.id).update(actions).then(function(result){
      // console.log(result);
      var customer = new Customer(result.body);
      callback(null, customer);
    }).error(function (err) {
      console.log(err);
      callback(err, null);
    });
  }
}

exports.changePassword = function(customer, currentPassword, newPassword, callback){
  callback(new Error("Not yet implemented"), null)
}

exports.addAddress = function(customer, address, callback){
  var actions = {
    version: customer.version,
    actions: [{
      action: 'addAddress',
      address: address
    }]
  }

  updateCustomer(customer.id, actions).then(function(result){
    var customer = new Customer(result.body);
    callback(null, customer);
  }).error(function(err){
    console.log(err);
    callback(err, null);
  })
}

exports.deleteAddress = function(customer, addressId, callback){
  var actions = {
    version: customer.version,
    actions: [{
      action: "removeAddress",
      addressId: addressId
    }]
  }

  updateCustomer(customer.id, actions).then(function(result){
    var customer = new Customer(result.body);
    callback(null, customer);
  }).error(function(err){
    console.log(err);
    callback(err, null);
  })
}