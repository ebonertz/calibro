var SphereClient = require('../../clients/sphere.server.client.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    CountryLookup = require('country-data').lookup;
    entity = 'carts';

var actions = {
    addLineItem: 'addLineItem',
    removeLineItem: 'removeLineItem',
    changeLineItemQuantity: 'changeLineItemQuantity',
    addCustomLineItem: 'addCustomLineItem',
    setShippingAddress: 'setShippingAddress',
    setBillingAddress: 'setBillingAddress',
    setShippingMethod: 'setShippingMethod',
    addDiscountCode: 'addDiscountCode'
}

exports.addLineItem = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.addLineItem;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.removeLineItem = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.removeLineItem;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setShippingAddress = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.setShippingAddress;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setBillingAddress = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.setBillingAddress;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setShippingMethod = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.setShippingMethod;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.changeLineItemQuantity = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.changeLineItemQuantity;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.addDiscountCode = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.addDiscountCode;

    CommonService.update(entity, cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.createOrder = function (cartId, receipt, callback) {

    // Save info of Cart Payment in custom objects. Just in case we need them later.
    var newCustomObject = {
        container: 'checkoutInfo',
        key: cartId,
        value: receipt
    };

    CommonService.create('customObjects', newCustomObject);

    var country = CountryLookup.countries({name: receipt.x_country})[0];

    // Set Cart billing address
    var billindAddress = {
        address: {
            firstName: receipt.x_first_name,
            lastName: receipt.x_last_name,
            phone: receipt.x_phone,
            streetName: receipt.x_address,
            streetNumber: '',
            city: receipt.x_city,
            stater: receipt.x_state,
            postalCode: receipt.x_zip,
            country: country.alpha2
        }
    };

    exports.setBillingAddress(cartId, billindAddress, function (err, resultCart) {

        if (err) {
            callback(err, null);
            return;
        }

        // Create Order
        var order = {
            id: cartId,
            version: resultCart.version
        };

        CommonService.create('orders', order, function (err, result) {
            if (err) {
                callback(err, null);
                return;
            }

            callback(null, result);
        });

    });


}
