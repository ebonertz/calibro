'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  config = require('../../../config/config'),
  _ = require('lodash'),
  Promise = require('bluebird');

var entity = 'carts';


module.exports = function(app) {
  // Dependencies
  var CommonService = Promise.promisifyAll(require('./sphere.commons.server.service.js')(app)),
    CommonServiceAsync = require('./sphere.commonsasync.server.service.js').bind({
      entity: entity
    })(app),
    ProductService = require('./sphere.products.server.service.js')(app),
    AvalaraService = require('../../services/avalara.server.services.js')(app),
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
  };

  /*
    Getters
   */

  service.getCommonService = function() {
    return CommonServiceAsync;
  };

  service.getAvalaraService = function() {
    return AvalaraService;
  };

  service.getProductService = function() {
    return ProductService;
  };

  /*
    Constants
   */

  service.EXPANDS = {
    distributionChannel: 'lineItems[*].distributionChannel'
  };


  /*
    Service helpers
   */

  service.byId = CommonServiceAsync.byId;

  service.updateCart = function(cart, payload, expand) {
    if (cart.id && cart.version) {
      // When cart is passed, no need to fetch a new one
      return service.getCommonService().updateWithVersion(cart.id, cart.version, payload, expand);
    } else if (typeof cart !== 'object') {
      return service.getCommonService().update(cart, payload, expand);
    }
  };

  service.byCustomer = function(customerId, expand) {
    var opts = {
      where: 'cartState="Active" and customerId="' + customerId + '"',
      sort: ['lastModifiedAt', false]
    };

    return service.getCommonService().findOne(opts, expand);
  };

  service.activeById = function(cartId, expand) {
    var opts = {
      where: 'cartState="Active" and id="' + cartId + '"',
      sort: ['lastModifiedAt', false]
    };

    return service.getCommonService().findOne(opts, expand);
  }

  service.newCart = function(userId) {
    var newCart = {
      'currency': 'USD',
      'customerId': userId,
      'taxMode': 'External'
    };

    return service.getCommonService().save(newCart);
  }

  /*
    Service methods
   */

  service.addLineItem = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.addLineItem;

    return service.updateCart(cart, [payload], expand);
  };

  service.addCustomLineItem = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.addCustomLineItem;

    return service.updateCart(cart, [payload], expand);
  };

  service.removeLineItem = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.removeLineItem;

    return service.updateCart(cart, [payload], expand);
  };

  service.removeCustomLineItem = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.removeCustomLineItem;

    return service.updateCart(cart, [payload], expand);
  };

  service.getExternalTaxRate = function(taxLines, item, shippingAddress) {
    var taxLine = _.find(taxLines, function(taxLine) {
      return taxLine.LineNo === item.id;
    });

    if (!taxLine) {
      app.logger.debug('No tax line found for item', item.slug);
      return;
    } else {
      app.logger.debug('Tax line found for item', item.slug);
    }

    var tax = parseFloat(taxLine.Tax);
    var rate = parseFloat(taxLine.Rate);
    var externalTaxRate = {
      name: shippingAddress.postalCode,
      amount: tax === 0 ? 0 : rate,
      country: 'US'
    };

    return externalTaxRate;
  };

  service.setShippingAddress = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.setShippingAddress;

    // Update shipping
    return service.updateCart(cart, [payload], expand);
  };

  service.updateExternalRate = function(cart, expand) {
    return service.getAvalaraService().getSalesOrderTax(cart, AvalaraService.LINE_ITEM_TAX)
      .then(function(avalaraTax) {
        var actions = [];
        var externalTaxRate;

        var shippingAddress = cart.shippingAddress;
        var taxLines = avalaraTax.TaxLines;

        // Set taxes to line items
        _.each(cart.lineItems, function(item) {
          externalTaxRate = service.getExternalTaxRate(taxLines, item, shippingAddress);
          if (!externalTaxRate) {
            throw new Error('No tax rate for ', item.name.en);
          }

          var action = {
            action: 'setLineItemTaxRate',
            lineItemId: item.id,
            externalTaxRate: externalTaxRate
          };
          actions.push(action);
        });

        // Set taxes to customLineitems
        _.each(cart.customLineItems, function(item) {
          // External rate is picked up from the one calculated from the line items.
          // These have a taxline defined (unlike the custom line items)
          // TODO get taxlines for these items, otherwise we can get unexpected results
          if (!externalTaxRate) {
            throw new Error('No tax rate for ', item.name.en);
          }

          var action = {
            action: 'setCustomLineItemTaxRate',
            customLineItemId: item.id,
            externalTaxRate: externalTaxRate
          };

          actions.push(action);
        });

        // Recalculate item prices and taxes
        actions.push({
          action: 'recalculate',
          updateProductData: false // Change from true, as we only need the price/tax update
        });

        return actions;
      })
      .then(function(actions) {
        return service.updateCart(cart, actions, expand);
      });
  };

  service.setBillingAddress = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.setBillingAddress;

    return service.updateCart(cart, [payload], expand);
  };

  service.setShippingMethod = function(cartId, payload, expand) {
    if (payload)
      payload.action = actions.setShippingMethod;

    return service.updateCart(cartId, [payload])
      .then(function(cart) {
        return AvalaraService.getSalesOrderTax(cart, AvalaraService.SHIPPING_TAX)
          .then(function(avalaraTax) {

            var totalTax = parseFloat(avalaraTax.TotalTax);
            var externalTaxRate = {
              name: cart.shippingAddress.postalCode,
              amount: totalTax === 0 ? 0 : totalTax / (cart.shippingInfo.price.centAmount / 100),
              country: 'US'
            };
            var actions = [];

            actions.push({
              action: 'setShippingMethodTaxRate',
              externalTaxRate: externalTaxRate
            });
            actions.push({
              action: 'recalculate'
            });

            return actions;
          })
          .then(function(actions) {
            return service.updateCart(cart, actions, expand);
          });
      });
  };

  service.changeLineItemQuantity = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.changeLineItemQuantity;

    return service.updateCart(cart, [payload], expand);
  };

  service.addDiscountCode = function(cart, payload, expand) {
    if (payload)
      payload.action = actions.addDiscountCode;

    return service.updateCart(cart, [payload], expand);
  };

  service.addHighIndex = function(cart, payload, expand) {
    var quantity = payload.quantity;

    // Early bail-out if quantity is not valid
    if (quantity < 1) {
      return Promise.reject({
        status: 400
      });
    }

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
          };

          return action;
        }

        // Add new custom line item if there's none currently
        return TaxCategoryService.getFirst().then(function(taxCategory) {
          var action = {
            'action': 'addCustomLineItem',
            'name': {
              'en': 'High-index Lens',
            },
            'quantity': quantity,
            'money': {
              'currencyCode': 'USD',
              'centAmount': config.highIndex.price * 100 || 3000
            },
            'slug': config.highIndex.slug,
            'taxCategory': {
              typeId: 'tax-category',
              id: taxCategory.id
            }
          };

          return [action];
        });
      }).then(function(actions) {
        // Update cart
        return service.updateCart(cart, actions, expand);
      });
  };

  service.removeHighIndex = function(cart, lineId) {
    var payload = {
      customLineItemId: lineId
    };
    return service.removeCustomLineItem(cart, payload);
  };

  // TODO: Refactor with highIndex to reduce repetition
  service.addBlueBlock = function(cart, payload, expand) {
    var quantity = payload.quantity;

    // Early bail-out if quantity is not valid
    if (quantity < 1) {
      return Promise.reject({
        status: 400
      });
    }

    // Check if custom line item already exists
    return Promise.resolve().then(function() {
        return _.find(cart.customLineItems, {
          slug: config.blueBlock.slug
        });
      })
      .then(function(previousCustomLineItem) {

        // Update the current custom line item
        if (previousCustomLineItem) {
          var action = {
            action: 'changeCustomLineItemQuantity',
            customLineItemId: previousCustomLineItem.id,
            quantity: quantity
          };

          return action;
        }

        // Add new custom line item if there's none currently
        return TaxCategoryService.getFirst().then(function(taxCategory) {
          var action = {
            'action': 'addCustomLineItem',
            'name': {
              'en': 'Blue Block',
            },
            'quantity': quantity,
            'money': {
              'currencyCode': 'USD',
              'centAmount': config.blueBlock.price * 100 || 3000
            },
            'slug': config.blueBlock.slug,
            'taxCategory': {
              typeId: 'tax-category',
              id: taxCategory.id
            }
          };

          return [action];
        });
      }).then(function(actions) {
        // Update cart
        return service.updateCart(cart, actions, expand);
      });
  };

  service.removeBlueBlock = function(cart, lineId) {
    var payload = {
      customLineItemId: lineId
    };

    return service.removeCustomLineItem(cart, payload);
  };

  service.init = function(userId, cookieId, expand) {
    return Promise.resolve()
      .then(function() {
        if (userId) {
          return service.byCustomer(userId, expand);
        } else if (cookieId) {
          return service.activeById(cookieId, expand);
        }
      })
      .then(function(cart) {
        return cart || service.newCart(userId);
      })
      .catch(function() {
        return service.newCart(userId);
      })
  };

  // TODO: Review this method, currently not using promises
  service.refreshCart = function(cookieId, callback, expand) {
    SphereClient.setClient();
    var newCart = {
      'currency': 'USD',
      'taxMode': 'External'
    };

    CommonService.byId('carts', cookieId, function(err, cart) {
      if (err) {
        CommonService.create('carts', newCart, function(err, cart) {
          if (err) {
            callback(err, null);
          } else {
            app.logger.debug('Cart refreshed A - Cart ID: ' + cart.id);
            callback(null, cart);
          }
        });
      } else {
        callback(null, cart);

      }
    }, expand);
  };

  // TODO: Review this method, currently not using promises
  service.deleteBillingAddress = function(cartId, callback) {
    CommonService.byId('carts', cartId, function(err, cart) {
      if (err) {
        if (callback)
          callback(err, null);
      } else {

        if (cart.billingAddress == null) {
          if (callback)
            callback(null, cart);
        } else {
          service.setBillingAddress(cart.id, cart.version, {
            address: {}
          }, function(err, cart) {
            if (callback)
              callback(null, cart);
          });
        }
      }
    });
  };

  service.cartEyewearPrescriptionCount = function(cartId) {
    return service.byId(cartId, 'lineItems[*].distributionChannel')
      .then(function(cart) {

        var ids = _.map(cart.lineItems, function(li) {
          return '"' + li.productId + '"';
        }).join(',');

        var query = 'id in (' + ids + ')';

        // Get all products from the cart
        return service.getProductService().find(query, 'categories[*]')
          // Filter eyeglasses
          .then(function(products) {
            return _.filter(products, ['categories[0].obj.slug.en', 'eyeglasses']);
          })
          // Sum all the singlevision lineitems
          .then(function(eyewearProducts) {
            return _.reduce(eyewearProducts, function(sum, product) {
              var li = _.find(cart.lineItems, ['productId', product.id]);
              var distChan = _.get(li, 'distributionChannel.obj.key');

              // Sum 1 if distribution channel is singlevision
              return sum + (distChan === 'singlevision');
            }, 0);
          });
      });

  };

  return service;
};
