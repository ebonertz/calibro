var config = require('../../config/config');
var SphereClient = require('../clients/sphere.server.client.js');


module.exports = function (app) {
    var controller = {};
    config.sphere.api_host = config.sphere.api_url;
    config.sphere.oauth_url = config.sphere.auth_url;
    var options = {
        braintree: config.braintree,
        sphere: config.sphere,
        logger: app.logger
    };
    var braintreeSphereService = require('braintree-sphere-service')(options);


    controller.clientToken = function (req, res) {
        var customerId = undefined;
        if (req.query.customerId) {
            customerId = req.query.customerId;
        }
        braintreeSphereService.payment.clientToken(customerId).then(function (response) {
            res.json(response);
        });

    };

    controller.checkout = function (req, res) {
        var nonceFromTheClient = req.body.payment_method_nonce;
        var customerId = req.body.customerId;
        var submitForSettlement = req.body.submitForSettlement;
        if (!submitForSettlement) {
            submitForSettlement = true;
        }
        var parameters = {
            customerId: customerId,
            submitForSettlement: submitForSettlement,
            nonceFromTheClient: nonceFromTheClient,
            orderId: req.body.orderId
        };
        SphereClient.getClient().orders.byId(parameters.orderId).fetch().then(function (resultOrder) {
            parameters.amount = resultOrder.body.totalPrice.centAmount / 100;
            app.logger.info ("Paying with paypal Order: " + parameters.orderId + " with amount of: " + parameters.amount);
            braintreeSphereService.payment.checkout(parameters).then(function (response) {
                res.json(response);
            });
        });
    };

    return controller;
}
