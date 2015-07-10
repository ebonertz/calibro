var SphereClient = require('../../clients/sphere.server.client.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    TaxCategoryService = require('./sphere.taxCategories.server.service.js'),
    config = require('../../../config/config'),
    entity = 'carts';

var actions = {
    addLineItem: 'addLineItem',
    removeLineItem: 'removeLineItem',
    changeLineItemQuantity: 'changeLineItemQuantity',
    addCustomLineItem: 'addCustomLineItem',
    removeCustomLineItem: 'removeCustomLineItem',
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
};

exports.addCustomLineItem = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.addCustomLineItem;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
};

exports.removeLineItem = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.removeLineItem;

    CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.removeCustomLineItem = function (cartId, version, payload, callback) {
    if (payload)
        payload.action = actions.removeCustomLineItem;

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

exports.addHighIndex = function(cartId, version, payload, callback) {
    var quantity = payload.quantity;
    if(quantity < 1)
        return callback("No lines to apply high-index to");

    var taxCategory = TaxCategoryService.getFirst();
    var payload = {
        'name': {
            'en': "High-index Lens",
        },
        'quantity': quantity,
        'money': {
            // Move to config
            "currencyCode": "USD",
            "centAmount": config.highIndexPrice*100 || 3000
        },
        'slug': 'high-index-lens',
        'taxCategory': {
            typeId: 'tax-category',
            id: taxCategory.id
        }
    };

    exports.addCustomLineItem(cartId, version, payload, function (err, result) {
        callback(err, result);
    });
};

// Proxy
exports.removeHighIndex = function(cartId, version, lineId, callback) {
    var payload = {
        customLineItemId: lineId
    };
    exports.removeCustomLineItem(cartId, version, payload, callback);
}
