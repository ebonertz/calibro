'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    CustomerService = require('../../app/services/sphere/sphere.customers.server.service.js');

module.exports = function () {

    // Use local strategy
    passport.use('sphere-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            CustomerService.login(email, password, req.body.anonymousCartId, function (err, customer, cart) {
                if (err) {
                    return done(err);
                }

                return done(null, customer, cart);
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
