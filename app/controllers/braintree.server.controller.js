var config = require('../../config/config');
var SphereClient = require('../clients/sphere.server.client.js');


module.exports = function (app) {
    var CommonService = require('../services/sphere/sphere.commons.server.service.js')(app),
     MandrillService = require('../services/mandrill.server.service.js')(app),
      OrderService = require('../services/sphere/sphere.orders.server.service')(app);

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
        var orderId = req.body.orderId;

        SphereClient.getClient().orders.byId(orderId).fetch().then(function (resultOrder) {
            var resultOrder = resultOrder.body;
            var parameters = {
                customerId: customerId,
                submitForSettlement: submitForSettlement,
                nonceFromTheClient: nonceFromTheClient,
                orderId: orderId,
                orderNumber: resultOrder.orderNumber

            };
            parameters.amount = resultOrder.totalPrice.centAmount / 100;
            if (resultOrder.taxedPrice) {
                parameters.amount = resultOrder.taxedPrice.totalGross.centAmount / 100;
            }
           app.logger.info ("Paying Order: " + parameters.orderId + " with amount of: " + parameters.amount);

             if(parameters.amount != 0){
                 return braintreeSphereService.payment.checkout(parameters).then(function (response) {
                     if (response.success === true) {
                         SphereClient.getClient().orders.byId(parameters.orderId)
                           .expand('paymentInfo.payments[*]').fetch().then(function (result) {
                               return result.body;
                           })
                           .then (function (order){
                               if (order.customerId) {
                                   CommonService.byId('customers', order.customerId, function (err, customer) {
                                       if (!err && customer != null && customer.email != null) {
                                           MandrillService.orderConfirmation(customer, order);
                                       } else {
                                           app.logger.error("Error sending order confirmation mail. Error: %s", JSON.stringify(err));
                                       }

                                   });
                               }
                               else if (order.billingAddress.email) {
                                   MandrillService.orderConfirmation(order.billingAddress, order);
                               }
                               else if (resultOrder.shippingAddress.email) {
                                   MandrillService.orderConfirmation(order.shippingAddress, order);

                               }
                           });

                     }
                     res.json(response);
                 }).catch(function(err){
                     app.logger.error("Error in the braintree service. Error: %s", JSON.stringify(err));
                     return res.sendStatus(400);
                 });
             }else{
                 return OrderService.updatePaymentState(parameters.orderId)
                   .then(function(){
                       SphereClient.getClient().orders.byId(parameters.orderId)
                         .expand('paymentInfo.payments[*]').fetch().then(function (result) {
                             return result.body;
                         })
                         .then (function (order){
                             if (order.customerId) {
                                 CommonService.byId('customers', order.customerId, function (err, customer) {
                                     if (!err && customer != null && customer.email != null) {
                                         MandrillService.orderConfirmation(customer, order);
                                     } else {
                                         app.logger.error("Error sending order confirmation mail. Error: %s", JSON.stringify(err));
                                     }

                                 });
                             }
                             else if (order.billingAddress.email) {
                                 MandrillService.orderConfirmation(order.billingAddress, order);
                             }
                             else if (resultOrder.shippingAddress.email) {
                                 MandrillService.orderConfirmation(order.shippingAddress, order);

                             }
                         });
                       res.json({success:true});
                   })
             }
        })

    };

    return controller;
}
