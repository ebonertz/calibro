var SphereClient = require('../../clients/sphere.server.client.js'),
    CommonService = require('./sphere.commons.server.service.js'),
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


exports.byCustomer = function (customerId, callback) {
    var path = '?customerId=' + customerId;

    CommonService.GET_ApiCall(entity, path, function (err, data) {
        if (err)
            callback(err, null)
        else
            callback(null, data)
    });
};


exports.addLineItem = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.addLineItem;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.removeLineItem = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.removeLineItem;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setShippingAddress = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.setShippingAddress;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setBillingAddress = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.setBillingAddress;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.setShippingMethod = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.setShippingMethod;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.changeLineItemQuantity = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.changeLineItemQuantity;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.addDiscountCode = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.addDiscountCode;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}
