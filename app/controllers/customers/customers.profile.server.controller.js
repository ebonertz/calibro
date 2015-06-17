'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  CustomerService = require('../../services/sphere/sphere.customers.server.service.js'),
  Address = require('../../models/sphere/sphere.address.server.model.js'),
  MailchimpService = require('../../services/mailchimp.server.service.js'),
  CommonService = require('../../services/sphere/sphere.commons.server.service.js');

/**
 * Update user details
 */
exports.update = function(req, res) {
  // Init Variables
  var customer = req.user;
  var message = null;

  // For security measurement we remove the roles from the req.body object
  delete req.body.roles;

  if (customer) {
    // Merge existing user
    var updateValues = {
      firstName: req.body.firstName == customer.firstName ? null : req.body.firstName,
      lastName: req.body.lastName == customer.lastName ? null : req.body.lastName,
      email: req.body.email == customer.email ? null : req.body.email,
    }

    CustomerService.updateProfile(customer, updateValues, function(err, result){
      if (err) {
        return res.status(400).send({
          message: err.message
        });
      } else {
        if(updateValues.email){
          // TODO retry on fail?
          MailchimpService.updateMember(customer.email, updateValues.email, function(err){
            if(err){
              console.log(err.error)
              return res.status(400).send({
                message: "Could not update newsletter status."
              })
            }
              
            return loginAndSend(req, res, result)
          })
        }else{
          return loginAndSend(req, res, result)
        }
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
};

var loginAndSend = function(req, res, user){
  req.login(user, function(err) {
    if (err) {
      return res.status(400).send(err);
    } else {
      return res.json(user);
    }
  });
}

exports.changePassword = function(req, res){
  var customer = req.user;
  var message = null;

  if(customer){
    var newPassword = req.body.newPassword;
    var oldPassword = req.body.oldPassword;

    if(!newPassword)
      return res.status(400).send({message: "No new password"})

    if(!oldPassword)
      return res.status(400).send({message: "No old password"})

    CustomerService.changePassword(customer, oldPassword, newPassword, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}

exports.addAddress = function(req, res){
  var customer = req.user;
  var message = null;

  if(customer){

    var address = new Address(req.body);
    address.streetNumber = address.streetNumber.toString()

    CustomerService.addAddress(customer, address, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}

exports.deleteAddress = function(req, res){
  var customer = req.user;
  var message = null;

  if(customer){

    var addressId = req.params.id;
    if(!addressId)
      return res.status(400).send({message: "No address id"})

    // Verify the address belongs to the user
    if(_.findIndex(customer.addresses, 'id', addressId) < 0){
      return res.status(403);
    }

    CustomerService.deleteAddress(customer, addressId, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}

exports.updateAddress = function(req, res){
  var customer = req.user;
  var addressId = req.body.id;
  var address = new Address(req.body);

  if(customer){

    // Security
    var allowed = false;
    for(var i = 0; i < customer.addresses.length; i++){
      if(customer.addresses[i].id = addressId) allowed = true
    }
    if(!allowed) return res.status(403)

    var action = [{
      "action": "changeAddress",
      "addressId": addressId,
      "address": address
    }]

    CommonService.update('customers', customer.id, action, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400).send({
      message: 'User is not signed in'
    });
  }
}

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};