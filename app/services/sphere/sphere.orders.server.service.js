var MandrillService = require('../mandrill.server.service.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    CustomObjectService = require('./sphere.custom-objects.server.service.js'),
    CountryLookup = require('country-data').lookup,
    config = require('../../../config/config'),
    entity = 'orders',
    container = 'Orders';


var actions = {
    changePaymentState: 'changePaymentState'
}

exports.create = function (object, callback) {
    // Review high-index before creating the order

    // We need the next order number from counter container
    exports.getOrderNumber(function(err, result){
        if(err) callback(err)
        else{
            var orderNumber = result + 1;
            object.orderNumber = config.orderPrefix+orderNumber.toString();

            CommonService.create(entity, object, function (err, orderCreated) {
                if(err) {
                    // TODO: Find next order number instead of guessing one by one
                    if(String(err).indexOf("duplicate") > 0 && String(err).indexOf("orderNumber")){
                        // Hope getting to the expected order number
                        CustomObjectService.create('Counters', container, orderNumber);
                    }
                    callback(err, null);
                } else {
                    // TODO: Some error control to assure CustomObject update
                    CustomObjectService.create('Counters', container, orderNumber);

                    CommonService.byId('customers', orderCreated.customerId, function (err, customer) {
                        if(!err && customer != null && customer.email != null) {
                            MandrillService.orderConfirmation(customer.email,orderCreated, config.serverPath + '/#!/orders/' + orderCreated.id);
                        }else{
                            console.log(err)
                        }

                    });

                    callback(null, orderCreated);
                }

            });
        }
    })

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
};

exports.getOrderNumber = function(callback){
    CustomObjectService.find('Counters', container, function(err, result){
        if(err) callback(err)
        if(!result){
            exports.startOrderNumber(callback)
        }else{
            var number = parseInt(result.value);
            if(typeof number !== "number") exports.startOrderNumber(callback)
            else callback(null, number)
        }
    })
};

// Start a new count if one couldn't be found
exports.startOrderNumber = function(callback){
    CustomObjectService.create('Counters', container, 1, function(err, result){
        if(err) callback(err);
        else callback(null, result.value)
    })
}
