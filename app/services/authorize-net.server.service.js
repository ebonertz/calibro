var CryptoJS = require("crypto-js"),
    config = require('../../config/config'),
    CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    CommonService = require('./sphere/sphere.commons.server.service.js'),
    fs = require('fs'),
    OrderService = require('./sphere/sphere.orders.server.service.js');

var apiLoginID = config.authorizenet.apiLoginID,
    transactionKey = config.authorizenet.transactionKey;

exports.get = function (amount, callback) {

    CustomObjectService.find('globalInfo', 'lastPaymentNumber', function (err, customObject) {
        var lastPaymentNumber = 1;

        var newCustomObject = {
            container: 'globalInfo',
            key: 'lastPaymentNumber',
            value: lastPaymentNumber
        };

        if (customObject == null) {
            CommonService.create('customObjects', newCustomObject);
        } else {

            customObject.value++;
            lastPaymentNumber = customObject.value;

            CommonService.create('customObjects', customObject);

        }

        var now = new Date(),
            now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()),
            timeCorrection = config.authorizenet.timeCorrection;

        var time = (now_utc.getTime() / 1000);
        console.log("time: " + time);

        var timestamp = time - timeCorrection;

        var message = apiLoginID + '^' + lastPaymentNumber + '^' + timestamp + '^' + amount + '^';

        var hash = CryptoJS.HmacMD5(message, transactionKey).toString();

        console.log("apiLoginID: " + apiLoginID);
        console.log("transactionKey: " + transactionKey);
        console.log("lastPaymentNumber: " + lastPaymentNumber);
        console.log("timestamp: " + timestamp);
        console.log("hash: " + hash);

        var returnObj = {
            x_fp_sequence: lastPaymentNumber,
            x_fp_timestamp: timestamp,
            x_amount: amount,
            x_login: apiLoginID,
            x_tran_key: transactionKey,
            x_fp_hash: hash
        }

        console.log("--------------------");

        console.log(returnObj);

        callback(null, returnObj)

    });
}


exports.relay = function (receipt, callback) {

    var order = {
        id: receipt.cart_id, // TODO
        version: parseInt(receipt.cart_version) // TODO
    };

    /*
     1 This transaction has been approved.
     2 This transaction has been declined.
     3 There has been an error processing this transaction.
     4 This transaction is being held for review.
     */
    if (receipt.x_response_code == 1) {

        OrderService.create(order, function (err, orderCreated) {

            if (err) {
                callback(err, null);
                return;
            }

            // Save info of Cart Payment in custom objects. Just in case we need them later.
            var newCustomObject = {
                container: 'checkoutInfo',
                key: orderCreated.id,
                value: receipt
            };

            CommonService.create('customObjects', newCustomObject);


            OrderService.changePaymentState(orderCreated.id, {paymentState: 'Paid'}, function (err, resultOrder) {

                if (err) {
                    callback(err, null);
                    return;
                } else {

                    fs.readFile('app/views/authorize-net-scripts/success.server.view.html', 'utf8', function (err, data) {
                        if (err) {
                            callback(err, null);
                        }
                        var html = data.replace("%", (config.serverPath + '/#!/orders/' + resultOrder.id));
                        callback(null, html);

                    });


                }

            });

        });

    } else {
        callback(new Error('Error in Authorize.net payment process.'), null);
    }

}

