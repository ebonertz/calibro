var entity = 'carts';

module.exports = function (app) {
    var CartService = require('../services/sphere/sphere.carts.server.service.js')(app),
        ChannelService = require('../services/sphere/sphere.channels.server.service.js')(app),
        CommonService = require('../services/sphere/sphere.commons.server.service.js')(app),
        Cart = require('../models/sphere/sphere.cart.server.model.js') (app);

    var controller = {};
    controller.byCustomer = function (req, res) {
        var customerId = req.param('customerId');

        CartService.byCustomer(customerId, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                if (result.errors != null && result.errors.length > 0) {
                    return res.sendStatus(400);
                } else {
                    var cart = new Cart(result);
                    res.json(cart);
                }

            }
        });
    };

    controller.byId = function (req, res) {
        var id = req.param('cartId');

        CommonService.byId(entity, id, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        })
    };

    controller.addLineItem = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        if (payload.distributionChannel) {
            payload.distributionChannel = {
                typeId: "channel",
                id: ChannelService.getByKey(payload.distributionChannel).id
            }
        }

        CartService.addLineItem(cartId, version, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.removeLineItem = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        CartService.removeLineItem(cartId, version, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.setShippingAddress = function (req, res) {
        var cartId = req.param('cartId'),
            payload = req.body;

        CartService.setShippingAddress(cartId, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.setBillingAddress = function (req, res) {
        var cartId = req.param('cartId'),
            payload = req.body;

        CartService.setBillingAddress(cartId, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.setShippingMethod = function (req, res) {
        var cartId = req.param('cartId'),
            payload = req.body;

        CartService.setShippingMethod(cartId, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.changeLineItemQuantity = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        CartService.changeLineItemQuantity(cartId, version, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.addDiscountCode = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        CartService.addDiscountCode(cartId, version, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        });
    };

    controller.createOrder = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        // Create order and any associated notes
        CartService.createOrder(cartId, version, payload, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                res.redirect('/#!/orders/' + result.id)
            }
        });
    };

    controller.addHighIndex = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        var addLine = function (version) {
            CartService.addHighIndex(cartId, version, req.body, function (err, result) {
                if (err) {
                    return res.status(400).send(err.body.message);
                } else {
                    var cart = new Cart(result);
                    res.json(cart);
                }
            })
        };

        // Remove + add if already have the line (can't update quantity)
        if (payload.lineId) {
            CartService.removeHighIndex(cartId, version, payload.lineId, function (err, result) {
                if (result)
                    addLine(result.version)
                else
                    return res.status(400)
            });
        } else {
            addLine(version)
        }
    };

    controller.removeHighIndex = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        CartService.removeHighIndex(cartId, version, payload.lineId, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        })
    };

    controller.addBlueBlock = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        var addLine = function (version) {
            CartService.addBlueBlock(cartId, version, req.body, function (err, result) {
                if (err) {
                    return res.status(400).send(err.body.message);
                } else {
                    var cart = new Cart(result);
                    res.json(cart);
                }
            })
        };

        // Remove + add if already have the line (can't update quantity)
        if (payload.lineId) {
            CartService.removeBlueBlock(cartId, version, payload.lineId, function (err, result) {
                if (result)
                    addLine(result.version)
                else
                    return res.status(400)
            });
        } else {
            addLine(version)
        }
    };

    controller.removeBlueBlock = function (req, res) {
        var cartId = req.param('cartId'),
            version = parseInt(req.param('version')),
            payload = req.body;

        CartService.removeBlueBlock(cartId, version, payload.lineId, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                var cart = new Cart(result);
                res.json(cart);
            }
        })
    };

    controller.init = function (req, res) {
        var customerId = req.query.customer,
            cookieId = req.query.cookie;

        CartService.init(customerId, cookieId, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                res.json(result);
            }
        },'lineItems[*].distributionChannel');
    };

    return controller;
};
