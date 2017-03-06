'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    passport = require('passport'),
    RememberService = require('../../services/remember.server.service.js'),
    Promise = require('bluebird'),
    SphereHttpError = require('../../clients/sphere.server.client.js').SphereHttpError;

var entity = 'customers';

module.exports = function (app) {
    var MandrillService = require('../../services/mandrill.server.service.js')(app),
        CustomObjectsService = Promise.promisifyAll(
          require('../../services/sphere/sphere.custom-objects.server.service.js')(app)
        ),
        CustomerService = require('../../services/sphere/sphere.customers.server.service.js')(app),
        CartService = require('../../services/sphere/sphere.carts.server.service.js')(app),
        Cart = require('../../models/sphere/sphere.cart.server.model.js')(app);
    var controller = {};

    /**
     * Signup
     */
    controller.signup = function (req, res) {
        // For security measurement we remove the roles from the req.body object
        // delete req.body.roles;

        // Init Variables
        var body = req.body
        body.firstName = body.firstName || ""
        body.lastName = body.lastName || ""

        if (typeof body === 'undefined' || !body.email || !body.password) {
            return res.status(400).send({
                message: "Mandatory values missing"
            })
        }

        passport.authenticate('sphere-register', function (err, customer, info) {
            if (err) {
                var message = err.message.indexOf('duplicate') > 0 ? "This email has already been registered" : err.message
                return res.status(400).send({message: message})
            } else if (!customer) {
                return res.status(400).send({message: "Error creating user"});
            } else {
                // Remove sensitive data before login
                delete customer.password;

                // Send welcome email
                MandrillService.welcome(customer.email).then(
                    function () {
                        app.logger.info('Welcome email sent to %s', customer.email)
                    }, function (error) {
                        app.logger.error('Error sending welcome email to %s', customer.email)
                        app.logger.error(error)
                    }
                )

                // Login
                req.login(customer, function (err) {
                    if (err) {
                        return res.status(400).send(err);
                    } else {
                        return res.json(customer);
                    }
                });
            }
        })(req, res);
    };

    /**
     * Signin after passport authentication
     */
    controller.signin = function(req, res, next) {
      var response = {};

      new Promise(function(resolve, reject) {
        // Deal with the login callbacks here
        passport.authenticate('sphere-login', function(err, info) {
          if (err || !info.customer) {
            reject({info:err, message: 'Login incorrect'});
          } else {
            response = info;

            req.login(info.customer, function(err) {
              if(err) {
                reject({info: err, message: 'Issue login in customer. Please try again.'});
              }
              resolve(info);
            });
          }
        })(req, res, next);
      })
      .then(function(info) {
        return CartService.byId(info.cart.id, CartService.EXPANDS.distributionChannel);
      })
      .then(function(cart) {
        response.cart = cart;

        res.json(response);
      })
      .catch(function(err) {
        app.logger.error(err)
        res.status(400).send({message: err.message});
      });
    };

    /**
     * Signout
     */
    controller.signout = function(req, res) {
      req.logout();
      var cookieId = req.query.cookie;

      CartService.init(null, cookieId, CartService.EXPANDS.distributionChannel)
        .then(function(result) {
          var cart = new Cart(result);
          res.json(cart);
        })
        .catch(function(err) {
          app.logger.error(err);
          return res.status(500).send(err);
        });
    };

    controller.signWithToken = function(req, res) {
      var rem = req.body.rem,
        rid = req.body.rid;
      //anonymousCart = req.body.anonymousCart;

      if (!rem || !rid || rem.length < 5 || rid.length < 5) {
        res.statusCode(400);
      }

      return CustomObjectsService.findAsync('RememberMe', rem)
        .then(function(rememberObj){
          app.logger.info('RememberMe: %s', JSON.stringify(rememberObj));

          if (RememberService.encodeId(rememberObj.value, rem) !== rid) {
            throw new Error('Token not valid');
          }

          return CustomerService.byId(rememberObj.value);
        })
        .then(function(customer) {
          // Should follow same process as CartService.init
          return CartService.byCustomer(customer.id, CartService.EXPANDS.distributionChannel)
            .then(function(cart) {
              var result = {
                customer: customer,
                cart: cart
              };
              return res.json(result);
            });
        })
        .catch(SphereHttpError.NotFound, function() {
          res.sendStatus(404);
        })
        .catch(function(err) {
          app.logger.error(err);
          res.sendStatus(400);
        });
    };

    return controller;
}
