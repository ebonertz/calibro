'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  passport = require('passport');

/**
 * Signup
 */
exports.signup = function(req, res) {
  // For security measurement we remove the roles from the req.body object
  // delete req.body.roles;

  // Init Variables
  var body = req.body

  if(typeof body === 'undefined' || !body.email || !body.firstName || !body.lastName || !body.password){
    res.status(400).send({
      message: "Mandatory values missing"
    })
  }

  passport.authenticate('sphere-register', function(err, customer, info) {
    if (err) {
      var message = err.message.indexOf('duplicate') > 0 ? "This email has already been registered" : err.message
      res.status(400).send({message: message})
    }else if(!customer){
      res.status(400).send({message: "Error creating user"});
    } else {
      // Remove sensitive data before login
      delete customer.password;

      req.login(customer, function(err) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(customer);
        }
      });
    }
  })(req, res);
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
  passport.authenticate('sphere-login', function(err, customer, info) {
    if (err || !customer) {
      res.status(400).send({
        message: "Login incorrect"
      })
    } else {
      // Remove sensitive data before login
      delete customer.password;

      req.login(customer, function(err) {
        if (err) {
          res.status(400).send({
            message: "Issue login in customer. Please try again."
          })
          console.error(err)
        } else {
          res.json(customer);
        }
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function(req, res) {
  req.logout();
  res.redirect('/');
};