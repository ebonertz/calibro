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

exports.addHighIndex = function (cartId, version, payload, callback) {
    var quantity = payload.quantity;
    if (quantity < 1)
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
            "centAmount": config.highIndex.price * 100 || 3000
        },
        'slug': config.highIndex.slug,
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
exports.removeHighIndex = function (cartId, version, lineId, callback) {
    var payload = {
        customLineItemId: lineId
    };
    exports.removeCustomLineItem(cartId, version, payload, callback);
};


exports.init = function (userId, cookieId, callback) {

    var newCart = {
        "currency": "USD",
        "customerId": userId
    };

    if (userId) {

        exports.byCustomer(userId, function (err, cart) {

            if (err) {
                callback(err, null);
            } else {

                if (cart == null || cart.errors != null && cart.errors.length > 0) {

                    CommonService.create('carts', newCart, function (err, cart) {
                        if (err) {
                            callback(err, null);
                        } else {
                            console.log("Init Cart A - Cart created - Cart ID: " + cart.id);
                            callback(null, cart);
                        }
                    });

                } else {
                    console.log("Init Cart B - Customer has a cart - Cart ID: " + cart.id);
                    callback(null, cart);
                }
            }
        });

    } else {

        if (cookieId == null) {
            if (err) {
                callback(err, null);
            } else {
                console.log("Init Cart C - Cart created - Cart ID: " + cart.id);
                callback(null, cart);
            }
        } else {

            CommonService.byId('carts', cookieId, function (err, cart) {

                if (err) {
                    callback(err, null);
                } else {
                    // This check is to avoid showing a user cart, that started as an anonymous cart.
                    if (cart.customerId == null && cart.cartState == 'Active') {
                        console.log("Init Cart D - Customer has a cart from cookie - Cart ID: " + cart.id);
                        callback(null, cart);
                    } else {
                        CommonService.create('carts', newCart, function (err, cart) {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log("Init Cart E - Cart created - Cart ID: " + cart.id);
                                callback(null, cart);
                            }
                        });
                    }

                }
            });

        }
    }

}
