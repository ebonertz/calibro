var SphereClient = require('../../clients/sphere.server.client.js'),
    config = require('../../../config/config'),
    entity = 'carts';

module.exports = function (app) {
    var CommonService = require('./sphere.commons.server.service.js') (app),
        TaxCategoryService = require('./sphere.taxCategories.server.service.js')(app);
    var service = {};
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


    service.byCustomer = function (customerId, callback) {
        var path = '?customerId=' + customerId;

        CommonService.GET_ApiCall(entity, path, function (err, data) {
            if (err)
                callback(err, null)
            else
                callback(null, data)
        });
    };

    service.addLineItem = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.addLineItem;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    };

    service.addCustomLineItem = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.addCustomLineItem;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    };

    service.removeLineItem = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.removeLineItem;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    }

    service.removeCustomLineItem = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.removeCustomLineItem;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    }

    service.setShippingAddress = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setShippingAddress;

        SphereClient.getClient().carts.byId(cartId).fetch().then (function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                callback(err, result);
            });
        });

    }

    service.setBillingAddress = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setBillingAddress;

        SphereClient.getClient().carts.byId(cartId).fetch().then (function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                callback(err, result);
            });
        });

    }

    service.setShippingMethod = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setShippingMethod;
        SphereClient.getClient().carts.byId(cartId).fetch().then (function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                callback(err, result);
            });
        });
    }

    service.changeLineItemQuantity = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.changeLineItemQuantity;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    }

    service.addDiscountCode = function (cartId, version, payload, callback) {
        if (payload)
            payload.action = actions.addDiscountCode;

        CommonService.updateWithVersion(entity, cartId, version, [payload], function (err, result) {
            callback(err, result);
        });
    }

    service.addHighIndex = function (cartId, version, payload, callback) {
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

        service.addCustomLineItem(cartId, version, payload, function (err, result) {
            callback(err, result);
        });
    };

// Proxy
    service.removeHighIndex = function (cartId, version, lineId, callback) {
        var payload = {
            customLineItemId: lineId
        };
        service.removeCustomLineItem(cartId, version, payload, callback);
    };


    service.init = function (userId, cookieId, callback) {
        SphereClient.setClient();
        var newCart = {
            "currency": "USD",
            "customerId": userId
        };

        if (userId) {

            service.byCustomer(userId, function (err, cart) {

                if (err) {
                    callback(err, null);
                } else {

                    if (cart == null || cart.errors != null && cart.errors.length > 0) {

                        CommonService.create('carts', newCart, function (err, cart) {
                            if (err) {
                                callback(err, null);
                            } else {
                                app.logger.debug("Init Cart A - Cart created - Cart ID: " + cart.id);
                                callback(null, cart);
                            }
                        });

                    } else {
                        app.logger.debug("Init Cart B - Customer has a cart - Cart ID: " + cart.id);
                        callback(null, cart);
                    }
                }
            });

        } else {

            if (cookieId == null) {
                CommonService.create('carts', newCart, function (err, cart) {
                    if (err) {
                        callback(err, null);
                    } else {
                        app.logger.debug("Init Cart C - Cart created - Cart ID: " + cart.id);
                        callback(null, cart);
                    }
                });
            } else {

                CommonService.byId('carts', cookieId, function (err, cart) {

                    if (err) {
                        CommonService.create('carts', newCart, function (err, cart) {
                            if (err) {
                                callback(err, null);
                            } else {
                                app.logger.debug("Init Cart F - Cart created - Cart ID: " + cart.id);
                                callback(null, cart);
                            }
                        });
                    } else {
                        // This check is to avoid showing a user cart, that started as an anonymous cart.
                        if (cart.customerId == null && cart.cartState == 'Active') {
                            app.logger.debug("Init Cart D - Customer has a cart from cookie - Cart ID: " + cart.id);
                            callback(null, cart);
                        } else {
                            CommonService.create('carts', newCart, function (err, cart) {
                                if (err) {
                                    callback(err, null);
                                } else {
                                    app.logger.debug("Init Cart E - Cart created - Cart ID: " + cart.id);
                                    callback(null, cart);
                                }
                            });
                        }

                    }
                });

            }
        }

    }

    service.deleteBillingAddress = function (cartId, callback) {
        CommonService.byId('carts', cartId, function (err, cart) {
            if (err) {
                if (callback)
                    callback(err, null);
            } else {

                if (cart.billingAddress == null) {
                    if (callback)
                        callback(null, cart);
                } else {
                    service.setBillingAddress(cart.id, cart.version, {address: {}}, function (err, cart) {
                        if (callback)
                            callback(null, cart);
                    });
                }
            }
        });
    };

    return service;
}
