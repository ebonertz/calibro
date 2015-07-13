var MandrillService = require('../mandrill.server.service.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    CountryLookup = require('country-data').lookup,
    config = require('../../../config/config'),
    entity = 'orders';

var actions = {
    changePaymentState: 'changePaymentState'
}

exports.create = function (object, callback) {
    CommonService.create(entity, object, function (err, orderCreated) {
        if (err) {
            callback(err, null);
        } else {

            CommonService.byId('customers', orderCreated.customerId, function (err, customer) {
                if(!err && customer != null && customer.email != null) {
                    MandrillService.orderCreated(customer.email, orderCreated.id, config.serverPath + '/#!/orders/' + orderCreated.id);
                    // If at any point the order's id is different to the cart's id, use the following
                    //PrescriptionService.toOrder(object.id, orderCreated.id)
                }

            });

            callback(null, orderCreated);
        }

    });
}

exports.changePaymentState = function (orderId, payload, callback) {
    if (payload)
        payload.action = actions.changePaymentState;

    CommonService.update(entity, orderId, [payload], function (err, result) {
        callback(err, result);
    });
}

// TODO: Should be deleted when merge.
exports.payOrder = function (orderId, receipt, callback) {

    // Save info of Cart Payment in custom objects. Just in case we need them later.
    var newCustomObject = {
        container: 'checkoutInfo',
        key: orderId,
        value: receipt
    };

    CommonService.create('customObjects', newCustomObject);

    /*
     1 This transaction has been approved.
     2 This transaction has been declined.
     3 There has been an error processing this transaction.
     4 This transaction is being held for review.
     */

    if (receipt.x_response_code == 1) {
        exports.changePaymentState(orderId, {paymentState: 'Paid'}, function (err, resultOrder) {

            if (err) {
                callback(err, null);
                return;
            } else {
                callback(null, resultOrder);
            }

        });
    } else {
        callback(new Error('Error in Authorize.net payment process.'), null);
    }
}
