'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    CustomerService = require('../../app/services/sphere/sphere.customers.server.service.js');

module.exports = function () {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // Serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user
    // TODO: change to sphere/cache
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Use local strategy
    passport.use('sphere-login', new LocalStrategy({
          usernameField: 'email',
          passwordField: 'password'
      },
      function (email, password, done) {
        CustomerService.login(email, password, function (err, customer) {
          if (err) {
            return done(err);
          }
          if (!customer) {
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }
          if (false) { // TODO: Check passwords match.
            return done(null, false, {
              message: 'Unknown user or invalid password'
            });
          }

          return done(null, customer);
        });
      }
    ));

    passport.use('sphere-register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function (req, email, password, done) {
        var customer = {
          "email": email,
          "password": password,
          "firstName": req.body.firstName,
          "lastName": req.body.lastName
        }
        CustomerService.create(customer, function (err, customer) {
          if (err) {
            return done(err);
          } else {
            return done(null, customer)
          }
        });
      }
    ));
};
