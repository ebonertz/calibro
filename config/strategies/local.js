'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    CustomerService = require('../../app/services/customers.sphere.server.service.js');

module.exports = function () {
    // Use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        },
        function (username, password, done) {

            CustomerService.login(username, password, function (err, user) {
                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }
                if (false) { // TODO: Check passwords match.
                    return done(null, false, {
                        message: 'Unknown user or invalid password'
                    });
                }

                return done(null, user);
            });
        }
    ));
};
