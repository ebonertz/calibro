'use strict';

var EXPAND = {
    distributionChannel: 'lineItems[*].distributionChannel'
  };

module.exports = function(app) {
  var CartService = require('../services/sphere/sphere.carts.server.service.js')(app),
    ChannelService = require('../services/sphere/sphere.channels.server.service.js')(app),
    Cart = require('../models/sphere/sphere.cart.server.model.js')(app);

  var controller = {};

  controller.byCustomer = function(req, res) {
    var customerId = req.param('customerId');

    CartService.byCustomer(customerId)
      .then(function(result) {
        // Return response
        var cart = new Cart(result);
        return res.json(cart);
      })
      .catch(function(err) {
        // Error
        if (err.statusCode === '404') {
          res.status(404);
        } else {
          app.logger.error(err);
          return res.status(500).send(err);
        }
      });
  };

  controller.byId = function(req, res) {
    var cartId = req.param('cartId');

    CartService.byId(cartId, EXPAND.distributionChannel)
      .then(function(result) {
        // Return response
        var cart = new Cart(result);
        return res.json(cart);
      })
      .catch(function(err) {
        // Error
        if (err.statusCode === '404') {
          res.status(404);
        } else {
          app.logger.error(err);
          return res.status(500).send(err);
        }
      });
  };

  controller.addLineItem = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    if (!payload.distributionChannel) {
      app.logger.warn('[AddLineItem] Payload contained no distribution channel');
      return res.status(400).send('Distribution Channel required to add line items');
    }

    // Fetch distribution channel
    return ChannelService.byKey(payload.distributionChannel)
      .then(function(distributionChannel) {
        payload.distributionChannel = {
          typeId: 'channel',
          id: distributionChannel.id
        };

        return CartService.addLineItem(cartId, payload, EXPAND.distributionChannel);
      })
      .then(function(result) {
        // Return response
        var cart = new Cart(result);
        return res.json(cart);
      })
      .catch(function(err) {
        // Error
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.removeLineItem = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.removeLineItem(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        // Return response
        var cart = new Cart(result);
        return res.json(cart);

      })
      .catch(function(err) {
        // Error
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.setShippingAddress = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.setShippingAddress(cartId, payload)
      .then(function(cart) {
        return CartService.updateExternalRate(cart, EXPAND.distributionChannel);
      })
      .then(function(result) {
        // TODO: move to services, controller should only provide a sendable version of the cart
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.setBillingAddress = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    CartService.setBillingAddress(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        // TODO: move to services, controller should only provide a sendable version of the cart
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.setShippingMethod = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    CartService.setShippingMethod(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        // TODO: move to services, controller should only provide a sendable version of the cart
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.changeLineItemQuantity = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    CartService.changeLineItemQuantity(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        // TODO: move to services, controller should only provide a sendable version of the cart
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.addDiscountCode = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.addDiscountCode(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.createOrder = function(req, res) {
    var cartId = req.param('cartId'),
      version = parseInt(req.param('version')),
      payload = req.body;

    // Create order and any associated notes
    CartService.createOrder(cartId, version, payload, function(err, result) {
      if (err) {
        return res.status(400).send(err.body.message);
      } else {
        res.redirect('/#!/orders/' + result.id);
      }
    });
  };

  controller.addHighIndex = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.addHighIndex(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.removeHighIndex = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.removeHighIndex(cartId, payload.lineId, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.addBlueBlock = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.addBlueBlock(cartId, payload, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  controller.removeBlueBlock = function(req, res) {
    var cartId = req.param('cartId'),
      payload = req.body;

    return CartService.removeBlueBlock(cartId, payload.lineId, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  // TODO: Move to promise
  controller.init = function(req, res) {
    var customerId = req.query.customer,
      cookieId = req.query.cookie;

    CartService.init(customerId, cookieId, EXPAND.distributionChannel)
      .then(function(result) {
        var cart = new Cart(result);
        res.json(cart);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500).send(err);
      });
  };

  // TODO: Move to promise
  controller.refreshCart = function(req, res) {
    var cookieId = req.query.cookie;

    CartService.refreshCart(cookieId, function(err, result) {
      if (err) {
        return res.status(400).send(err.body.message);
      } else {
        res.json(result);
      }
    }, EXPAND.distributionChannel);
  };

  controller.cartEyewearPrescriptionCount = function(req, res) {
    var id = req.param('cartId');

    return CartService.cartEyewearPrescriptionCount(id)
      .then(function(count) {
        return res.json(count);
      })
      .catch(function(err) {
        app.logger.error(err);
        return res.status(500);
      });
  };

  return controller;
};
