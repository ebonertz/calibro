'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    passport = require('passport'),
    RememberService = require('../../services/remember.server.service.js');


var entity = 'customers';

module.exports = function (app) {
    var MandrillService = require('../../services/mandrill.server.service.js')(app),
        CommonsService = require('../../services/sphere/sphere.commons.server.service.js')(app),
        CustomObjectsService = require('../../services/sphere/sphere.custom-objects.server.service.js')(app),
        CartService = require('../../services/sphere/sphere.carts.server.service.js')(app);
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
    controller.signin = function (req, res, next) {
        passport.authenticate('sphere-login', function (err, customer, info) {
            if (err || !customer) {
                res.status(400).send({
                    message: "Login incorrect"
                })
            } else {
                // Remove sensitive data before login
                delete customer.password;

                req.login(customer, function (err) {
                    if (err) {
                        res.status(400).send({
                            message: "Issue login in customer. Please try again."
                        })
                        app.logger.error(JSON.stringify(err))
                    } else {
                        req.session.user = req.user;

                        var result = {
                            customer: customer,
                            cart: info.cart
                        }

                        // Send remember me token if requested
                        if (info.hasOwnProperty('remember')) {
                            result.remember = info.remember
                        }

                        res.json(result);
                    }
                });
            }
        })(req, res, next);
    };

    /**
     * Signout
     */
    controller.signout = function (req, res) {
        req.logout();
        var cookieId = req.query.cookie;

        CartService.init(null, cookieId, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                res.json(result);
            }
        });
    };

    controller.signWithToken = function (req, res) {
        var rem = req.body.rem,
            rid = req.body.rid;
        //anonymousCart = req.body.anonymousCart;

        if (!rem || !rid || rem.length < 5 || rid.length < 5) {
          res.statusCode(400);
        }

        // TODO: Clean up this callback hell
            CustomObjectsService.find('RememberMe', rem, function (err, customobject) {
                if (err || !customobject) {
                    app.logger.error("Error in signWithToken method: %s", JSON.stringify(err))
                    res.sendStatus(400)
                } else {
                    app.logger.info("RemmberMe object: %s", JSON.stringify(customobject));

                    if (RememberService.encodeId(customobject.value, rem) != rid) {
                        return res.status(400).send({message: 'Token not valid'});
                    }

                    CommonsService.byId(entity, customobject.value, function (err, customer) {
                        if (err) {
                            app.logger.error("Error obtaining customObkect by Id: %s", JSON.stringify(err));
                            res.status(400)
                        } else {
                            CommonsService.byCustomer('carts', customer.id, function (err, cart) {
                                if (err) {
                                    app.logger.error("Error on byCustomer: %s", JSON.stringify(err));
                                    return res.status(400)
                                } else {
                                    var result = {
                                        customer: customer,
                                        cart: cart[0]
                                    }
                                    return res.json(result)
                                }
                            })
                        }
                    })
                }
            })
    }

    return controller;
}
