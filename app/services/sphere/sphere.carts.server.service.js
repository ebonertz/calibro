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
    setShippingMethod: 'setShippingMethod'
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

