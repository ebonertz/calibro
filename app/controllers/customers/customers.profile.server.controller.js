'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  errorHandler = require('../errors.server.controller.js'),
  CustomerService = require('../../services/sphere/sphere.customers.server.service.js'),
  Address = require('../../models/sphere/sphere.address.server.model.js'),
  MailchimpService = require('../../services/mailchimp.server.service.js'),
  MandrillService = require('../../services/mandrill.server.service.js'),
  CommonService = require('../../services/sphere/sphere.commons.server.service.js'),
 SphereClient = require('../../clients/sphere.server.client.js'),
  config = require('../../../config/config');

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

exports.resetPasswordEmail = function(req, res){
  var email = req.body.email,
    path = config.serverPath+'/password/reset/'

  SphereClient.getClient().customers._save('/customers/password-token', {email: email}).then (function (result) {
    MandrillService.sendPasswordToken(email, path + result.body.value).then(function(result){
      return res.json(result);
    }, function(err){
      res.status(400).send({message: "We could not send the email, please try again"})
    })
  },function (err) {
    return res.status(400).send({message: err.message})
  });

}

exports.requestPasswordReset = function(req, res){
  var token = req.body.token,
    password = req.body.password

  CommonService.get('customers', '/customers/?token='+token, function(err, result){
    if(err)
      return res.status(400).send({message: "Token no longer valid"})

    var payload = {
      id: result.id,
      version: result.version,
      tokenValue: token,
      newPassword: password
    }

    CommonService.post('customers', '/api/customers/password/reset', payload, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  })  
}

exports.changePassword = function(req, res){
  var customer = req.user;

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
        return res.json({
          message: "Password updated successfully"
        });
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

  if(customer){

    var address = new Address(req.body);

    var actions = [{
      "action": "addAddress",
      "address": address
    }]

    CommonService.update('customers', customer.id, actions, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400);
  }
}

exports.deleteAddress = function(req, res){
  var customer = req.user,
    addressId = req.params.id;

  if(customer && addressId){

    var actions = [{
      action: "removeAddress",
      addressId: addressId,
    }]

    CommonService.update('customers', customer.id, actions, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400);
  }
}

exports.updateAddress = function(req, res){
  var customer = req.user;
  var addressId = req.body.id;
  var address = new Address(req.body);

  if(customer && addressId){

    var actions = [{
      "action": "changeAddress",
      "addressId": addressId,
      "address": address
    }]

    CommonService.update('customers', customer.id, actions, function(err, result){
      if(err){
        return res.status(400).send({message: err.message})
      }else{
        return res.json(result);
      }
    })
  } else {
    res.status(400);
  }
}

/**
 * Send User
 */
exports.me = function(req, res) {
  res.json(req.user || null);
};
