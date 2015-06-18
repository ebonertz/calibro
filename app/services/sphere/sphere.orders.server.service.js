var CommonService = require('./sphere.commons.server.service.js'),
    CountryLookup = require('country-data').lookup,
    entity = 'orders';

var actions = {
    changePaymentState: 'changePaymentState'
}

exports.changePaymentState = function (orderId, payload, callback) {
    if (payload)
        payload.action = actions.changePaymentState;

    CommonService.update(entity, orderId, [payload], function (err, result) {
        callback(err, result);
    });
}

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
