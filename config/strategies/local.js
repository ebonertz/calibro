'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    CustomerService = require('../../app/services/sphere/sphere.customers.server.service.js'),
    CommonService = require('../../app/services/sphere/sphere.commons.server.service.js'),
    RememberService = require('../../app/services/remember.server.service.js');

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

                var info = {cart: cart}

                // Return remember info
                if(req.body.rememberme){
                    var rem = RememberService.getToken(customer.id),
                        remember = {
                            rem: rem,
                            rid: RememberService.encodeId(customer.id, rem)
                        },
                        rememberCustomObject = {
                            container: 'RememberMe',
                            key: remember.rem,
                            value: customer.id
                        }

                    // Create customobject with remember info
                    CommonService.create('customObjects', rememberCustomObject);
                    info.remember = remember;
                }

                return done(null, customer, info);
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
