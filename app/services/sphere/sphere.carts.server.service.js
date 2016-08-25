var SphereClient = require('../../clients/sphere.server.client.js'),
    config = require('../../../config/config'),
    _ = require('lodash');
entity = 'carts';

module.exports = function (app) {
    var CommonService = require('./sphere.commons.server.service.js')(app),
        ZipTaxService = require('../../services/ziptax.server.services.js')(app),
        Cart = require('../../models/sphere/sphere.cart.server.model.js')(app);
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


    service.byCustomer = function (customerId, callback, expand) {
        SphereClient.getClient()[entity].where('cartState="Active" and customerId="' + customerId + '"').sort('createdAt', false).expand(expand).all().fetch().then(function (result) {
            if (result.body.results && result.body.results.length > 0) {
                callback(null, result.body.results[0]);
            } else {
                callback(null, null);
            }
        }).error(function (err) {
            app.logger.error("Error finding by customer entity: %s. Error: %s", entity, JSON.stringify(err));
            callback(err, null);
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

        SphereClient.getClient().carts.byId(cartId).fetch().then(function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                ZipTaxService.getTaxByZipCode(result.shippingAddress.postalCode).then(function(taxValue){
                    var externalTaxRate = {
                        name: result.shippingAddress.postalCode,
                        amount: taxValue,
                        country: "US"

                    };
                    //set taxes to line items
                    var actions = [];
                    _.each (result.lineItems, function (item){
                       var payload = {
                           action: "setLineItemTaxRate",
                           lineItemId: item.id,
                           externalTaxRate: externalTaxRate
                       }
                        actions.push (payload);
                    });

                    //set taxes to customLineitems
                    _.each (result.customLineItems, function (item){
                        var payload = {
                            action: "setCustomLineItemTaxRate",
                            customLineItemId: item.id,
                            externalTaxRate: externalTaxRate
                        }
                        actions.push (payload);
                    });
                    actions.push ({
                        action: "recalculate",
                        updateProductData: true
                    });
                    CommonService.updateWithVersion('carts', result.id, result.version, actions, function (err, cart) {
                        callback(err, cart);
                    });
                }).error(function(err){
                    logger.error('Error setting tax values from ziptax: %s', err);
                    return res.status(400).send(err.body.message);
                });
            });
        });

    }

    service.setBillingAddress = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setBillingAddress;

        SphereClient.getClient().carts.byId(cartId).fetch().then(function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                callback(err, result);
            });
        });

    }

    service.setShippingMethod = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setShippingMethod;

        SphereClient.getClient().carts.byId(cartId).fetch().then(function (cart) {
            CommonService.updateWithVersion(entity, cartId, cart.body.version, [payload], function (err, result) {
                ZipTaxService.getTaxByZipCode(result.shippingAddress.postalCode).then(function (taxValue) {
                    var externalTaxRate = {
                        name: result.shippingAddress.postalCode,
                        amount: taxValue,
                        country: "US"

                    };
                    var actions = [];
                    actions.push({
                        action: "setShippingMethodTaxRate",
                        externalTaxRate: externalTaxRate
                    });
                    actions.push({
                        action: "recalculate"
                    });
                    CommonService.updateWithVersion('carts', result.id, result.version, actions, function (err, cart) {
                        callback(err, cart);
                    });
                });
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


    service.addBlueBlock = function (cartId, version, payload, callback) {
        var quantity = payload.quantity;
        if (quantity < 1)
            return callback("No lines to apply high-index to");

        var taxCategory = TaxCategoryService.getFirst();
        var payload = {
            'name': {
                'en': "Blue Block",
            },
            'quantity': quantity,
            'money': {
                // Move to config
                "currencyCode": "USD",
                "centAmount": config.blueBlock.price * 100 || 3000
            },
            'slug': config.blueBlock.slug,
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
    service.removeBlueBlock = function (cartId, version, lineId, callback) {
        var payload = {
            customLineItemId: lineId
        };
        service.removeCustomLineItem(cartId, version, payload, callback);
    };

    service.init = function (userId, cookieId, callback, expand) {
        SphereClient.setClient();
        var newCart = {
            "currency": "USD",
            "customerId": userId,
            "taxMode": "External"
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
            }, expand);

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
                }, expand);

            }
        }

    }


    service.refreshCart = function (cookieId, callback, expand) {
        SphereClient.setClient();
        var newCart = {
            "currency": "USD",
            "taxMode": "External"
        };

            CommonService.byId('carts', cookieId, function (err, cart) {
                if (err) {
                    CommonService.create('carts', newCart, function (err, cart) {
                        if (err) {
                            callback(err, null);
                        } else {
                            app.logger.debug("Cart refreshed A - Cart ID: " + cart.id);
                            callback(null, cart);
                        }
                    });
                } else {
                    newCart ['lineItems'] = cart.lineItems;
                    CommonService.create('carts', newCart, function (err, cart) {
                        if (err) {
                            callback(err, null);
                        } else {
                            app.logger.debug("Refresh cart B - Cart ID: " + cart.id);
                            callback(null, cart);
                        }
                    });

                }
            }, expand);




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

    service.cartEyewearPrescriptionCount = function (cartId, callback) {
        CommonService.byId('carts', cartId, function (err, result) {
            if (err) {
                if (callback)
                    callback(err, null);
            } else {
                var cart = new Cart(result);
                var productIds = _.chain(cart.lineItems).map("productId").map(function (id) {
                    return '"' + id + '"';
                }).value();
                var eyewearPrescriptionAmount = 0;

                SphereClient.getClient().productProjections.staged(false).expand('categories[*]').where('id in (' + productIds.join(',') + ')').all().fetch().then(function (result) {

                    if (result.body.results && result.body.results.length > 0) {
                        var eyewearProductArray = _.reduce(result.body.results, function (eyewearProducts, product) {
                            if (product.categories[0].obj.slug.en === "eyewear") {
                                eyewearProducts.push(product);
                            }
                            return eyewearProducts;
                        }, []);

                        _.each(eyewearProductArray, function (product) {
                            var lineItem = _.find(cart.lineItems, function (item) {
                                return item.productId == product.id;
                            });
                            if (lineItem.distributionChannel.key && lineItem.distributionChannel.key != 'nonprescription' || lineItem.distributionChannel.obj && lineItem.distributionChannel.obj.key && lineItem.distributionChannel.obj.key != 'nonprescription') {
                                eyewearPrescriptionAmount += lineItem.quantity;
                            }
                        });
                        callback(null, eyewearPrescriptionAmount);
                    } else {
                        callback(null, eyewearPrescriptionAmount);
                    }
                }).error(function (err) {
                    app.logger.error("Error executing isAnyEyewear Error: %s", JSON.stringify(err));
                    callback(err, eyewearPrescriptionAmount);
                });

            }
        });

    };

    return service;
}
