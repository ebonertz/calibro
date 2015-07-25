var config = require('../../config/config'),
    CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    CartService = require('../services/sphere/sphere.carts.server.service.js'),
    CommonService = require('../services/sphere/sphere.commons.server.service.js'),
    Commons = require('./commons.server.service.js'),
    OrderService = require('./sphere/sphere.orders.server.service.js');


exports.setExpressCheckout = function (currencyCode, amount, cartId, callback) {

    var fullPath = '/nvp';

    fullPath += '?USER=' + config.paypal.username;
    fullPath += '&PWD=' + config.paypal.password;
    fullPath += '&SIGNATURE=' + config.paypal.signature;
    fullPath += '&VERSION=93';
    fullPath += '&METHOD=SetExpressCheckout';
    fullPath += '&PAYMENTREQUEST_0_PAYMENTACTION=SALE';
    fullPath += '&PAYMENTREQUEST_0_AMT=' + amount;
    fullPath += '&PAYMENTREQUEST_0_CURRENCYCODE=' + currencyCode;
    fullPath += '&RETURNURL=' + config.paypal.returnUrl + '?cart=' + cartId;
    fullPath += '&CANCELURL=' + config.paypal.cancelUrl + '?cart=' + cartId;
    fullPath += '&NOSHIPPING=1';

    var endpoint = {
        "host": config.paypal.host,
        "path": fullPath,
        "method": "GET",
        "headers": {}
    };

    CartService.deleteBillingAddress(cartId);

    Commons.doRequestNoParse(endpoint, function (err, data) {
        if (err)
            callback(err, null)
        else {
            var map = Commons.parseKeyValuePairs(data, '&');
            console.log(map)
            callback(null, map)
        }
    });

}

exports.getExpressCheckoutDetails = function (token, cartId, callback) {

    var fullPath = '/nvp';

    fullPath += '?USER=' + config.paypal.username;
    fullPath += '&PWD=' + config.paypal.password;
    fullPath += '&SIGNATURE=' + config.paypal.signature;
    fullPath += '&VERSION=93';
    fullPath += '&METHOD=GetExpressCheckoutDetails';
    fullPath += '&TOKEN=' + token;

    var endpoint = {
        "host": config.paypal.host,
        "path": fullPath,
        "method": "GET",
        "headers": {}
    };

    Commons.doRequestNoParse(endpoint, function (err, data) {
        if (err)
            callback(err, null)
        else {
            var map = Commons.parseKeyValuePairs(data, '&');

            var newCustomObject = {
                container: 'paypalInfo',
                key: cartId,
                value: map
            };

            CommonService.create('customObjects', newCustomObject);

            callback(null, map)
        }
    });
}

exports.doExpressCheckoutPayment = function (currencyCode, amount, token, payerId, callback) {

    var fullPath = '/nvp';

    fullPath += '?USER=' + config.paypal.username;
    fullPath += '&PWD=' + config.paypal.password;
    fullPath += '&SIGNATURE=' + config.paypal.signature;
    fullPath += '&VERSION=93';
    fullPath += '&METHOD=DoExpressCheckoutPayment';
    fullPath += '&PAYMENTREQUEST_0_PAYMENTACTION=SALE';
    fullPath += '&PAYMENTREQUEST_0_AMT=' + amount;
    fullPath += '&PAYMENTREQUEST_0_CURRENCYCODE=' + currencyCode;
    fullPath += '&PAYERID=' + payerId;
    fullPath += '&TOKEN=' + token;

    var endpoint = {
        "host": config.paypal.host,
        "path": fullPath,
        "method": "GET",
        "headers": {}
    };

    Commons.doRequestNoParse(endpoint, function (err, data) {
        if (err)
            callback(err, null)
        else {
            var map = Commons.parseKeyValuePairs(data, '&');
            callback(null, map)
        }
    });

}


