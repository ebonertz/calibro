'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    RememberService = require('../../app/services/remember.server.service.js');


module.exports = function (app) {
    var CustomerService = require('../../app/services/sphere/sphere.customers.server.service.js')(app),
        CommonService = require('../../app/services/sphere/sphere.commons.server.service.js')(app);

    // Use local strategy
    passport.use('sphere-login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      function(req, email, password, done) {
        var info = {};

        var anonCartId = req.body.anonymousCartId,
          rememberMe = req.body.rememberme;

        CustomerService.login(email, password, anonCartId)
          .then(function(customer) {

            if(!customer) {
              throw new Error('No customer');
            }

            delete customer.password;
            info.customer = customer;

            // TODO: Cleanup
            if (rememberMe) {
              var rem = RememberService.getToken(customer.id),
                remember = {
                  rem: rem,
                  rid: RememberService.encodeId(customer.id, rem)
                },
                rememberCustomObject = {
                  container: 'RememberMe',
                  key: rem,
                  value: customer.id
                };

              CommonService.create('customObjects', rememberCustomObject);
              info.remember = remember;
            }

            return done(null, info);
          })
          .catch(function (err) {
            return done(err, null);
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
