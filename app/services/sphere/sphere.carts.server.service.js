var SphereClient = require('../../clients/sphere.server.client.js'),
    config = require('../../../config/config'),
    _ = require('lodash'),
    Promise = require('bluebird');

var entity = 'carts';

module.exports = function (app) {
    // Dependencies
    var CommonService = Promise.promisifyAll(require('./sphere.commons.server.service.js')(app)),
        AvalaraService = require('../../services/avalara.server.services.js')(app),
        Cart = require('../../models/sphere/sphere.cart.server.model.js')(app),
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

    /*
      Getters
     */

    service.getCommonService = function (){
      return CommonService;
    }

    service.getAvalaraService = function () {
      return AvalaraService;
    }


    /*
      Service methods
     */
    service.byCustomer = function (customerId, callback, expand) {
        SphereClient.getClient()[entity].where('cartState="Active" and customerId="' + customerId + '"').sort('createdAt', false).expand(expand).all().fetch().then(function (result) {
            if (result.body.results && result.body.results.length > 0) {
                callback(null, result.body.results[0]);
            } else {
                callback(null, null);
            }
        }).catch(function (err) {
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

    service.getExternalTaxRate = function (taxLines, item, shippingAddress) {
      var taxLine = _.find(taxLines,function (taxLine) {
        return taxLine.LineNo == item.id
      });

      if (!taxLine) {
        app.logger.debug('No tax line found for item', item.slug);
        return
      } else {
        app.logger.debug('Tax line found for item', item.slug);
      }

      var tax = parseFloat (taxLine.Tax);
      var rate = parseFloat (taxLine.Rate);
      var externalTaxRate = {
        name: shippingAddress.postalCode,
        amount:  tax == 0 ? 0 : rate,
        country: "US"
      };

      return externalTaxRate;
    }

    service.setShippingAddress = function (cartId, payload, callback) {
        if (payload)
            payload.action = actions.setShippingAddress;

        // Update shipping
        return service.getCommonService().byIdAsync(entity, cartId)
        .then(function (cart) {
          return service.getCommonService().updateWithVersionAsync(entity, cart.id, cart.version, [payload]);
        });
    }

    service.updateExternalRate = function(cart) {
      return service.getAvalaraService().getSalesOrderTax(cart, AvalaraService.LINE_ITEM_TAX)
      .then(function (avalaraTax) {
        var actions = [];
        var externalTaxRate;

        // Set taxes to line items
        _.each (cart.lineItems, function (item){
          externalTaxRate = service.getExternalTaxRate(avalaraTax.TaxLines, item, cart.shippingAddress);
          if (!externalTaxRate) {
            throw new Error('No tax rate for ', item.name.en);
          }

          var action = {
            action: "setLineItemTaxRate",
            lineItemId: item.id,
            externalTaxRate: externalTaxRate
          }
          actions.push(action);
        });

        // Set taxes to customLineitems
        _.each (cart.customLineItems, function (item){
          // External rate is picked up from the one calculated from the line items.
          // These have a taxline defined (unlike the custom line items)
          // TODO get taxlines for these items, otherwise we can get unexpected results
          if (!externalTaxRate) {
            throw new Error('No tax rate for ', item.name.en)
          }

          var action = {
            action: "setCustomLineItemTaxRate",
            customLineItemId: item.id,
            externalTaxRate: externalTaxRate
          }

          actions.push(action);
        });

        // Recalculate item prices and taxes
        actions.push ({
          action: "recalculate",
          updateProductData: false // Change from true, as we only need the price/tax update
        });

        return actions;
      })
      .then(function (actions) {
        return service.getCommonService().updateWithVersionAsync(entity, cart.id, cart.version, actions)
      })
      // .then(function (updated_cart) {
      //   return new Cart(updated_cart)
      // })
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
                AvalaraService.getSalesOrderTax(result,AvalaraService.SHIPPING_TAX).then(function (avalaraTax) {
                    var totalTax = parseFloat(avalaraTax.TotalTax);
                    var externalTaxRate = {
                        name: result.shippingAddress.postalCode,
                        amount: totalTax == 0 ? 0 : totalTax/ (result.shippingInfo.price.centAmount/100),
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

    service.addHighIndex = function(cart, payload) {
      var quantity = payload.quantity;
      if (quantity < 1)
        return Promise.reject({
          status: 400
        });

      // Check if custom line item already exists
      return Promise.resolve().then(function() {
        return _.find(cart.customLineItems, {
          slug: config.highIndex.slug
        });
      })
      .then(function(previousCustomLineItem) {

        // Update current custom line item
        if (previousCustomLineItem) {
          var action = {
            action: 'changeCustomLineItemQuantity',
            customLineItemId: previousCustomLineItem.id,
            quantity: quantity
          }

          return action;
        }

        // Add new custom line item
        return TaxCategoryService.getFirst().then(function(taxCategory) {
          var action = {
            'action': 'addCustomLineItem',
            'name': {
              'en': "High-index Lens",
            },
            'quantity': quantity,
            'money': {
              "currencyCode": "USD",
              "centAmount": config.highIndex.price * 100 || 3000
            },
            'slug': config.highIndex.slug,
            'taxCategory': {
              typeId: 'tax-category',
              id: taxCategory.id
            }
          };

          return action;
        })
      }).then(function(action) {
        // Update cart
        return CommonService.updateWithVersionAsync(entity, cart.id, cart.version, [action]);
      });
    };

    // Proxy
    service.removeHighIndex = function (cartId, version, lineId, callback) {
        var payload = {
            customLineItemId: lineId
        };
        service.removeCustomLineItem(cartId, version, payload, callback);
    };

    service.addBlueBlock = function(cart, payload) {
      var quantity = payload.quantity;
      if (quantity < 1)
        return Promise.reject({
          status: 400
        });

      // Check if custom line item already exists
      return Promise.resolve().then(function() {
        return _.find(cart.customLineItems, {
          slug: config.blueBlock.slug
        });
      })
      .then(function(previousCustomLineItem) {

        // Update current custom line item
        if (previousCustomLineItem) {
          var action = {
            action: 'changeCustomLineItemQuantity',
            customLineItemId: previousCustomLineItem.id,
            quantity: quantity
          }

          return action;
        }

        // Add new custom line item
        return TaxCategoryService.getFirst().then(function(taxCategory) {

          var action = {
            'action': 'addCustomLineItem',
            'name': {
              'en': "Blue Block",
            },
            'quantity': quantity,
            'money': {
              "currencyCode": "USD",
              "centAmount": config.blueBlock.price * 100 || 3000
            },
            'slug': config.blueBlock.slug,
            'taxCategory': {
              typeId: 'tax-category',
              id: taxCategory.id
            }
          };

          return action;
        })
      }).then(function(action) {
        // Update cart
        return CommonService.updateWithVersionAsync(entity, cart.id, cart.version, [action]);
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
                    callback(null,cart)

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
                            if (product.categories[0].obj.slug.en === "eyeglasses") {
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
                }).catch(function (err) {
                    app.logger.error("Error executing isAnyEyewear Error: %s", JSON.stringify(err));
                    callback(err, eyewearPrescriptionAmount);
                });

            }
        });

    };

    return service;
}
