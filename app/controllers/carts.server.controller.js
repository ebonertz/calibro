var CartService = require('../services/sphere/sphere.carts.server.service.js'),
    ChannelsService = require('../services/sphere/sphere.channels.server.service.js');

exports.byCustomer = function (req, res) {
    var customerId = req.param('customerId');

    CartService.byCustomer(customerId, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            if (result.errors != null && result.errors.length > 0) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }

        }
    });
};

exports.addLineItem = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    if(payload.distributionChannel){
        payload.distributionChannel = {
            typeId: "channel",
            id: ChannelsService.getByKey(payload.distributionChannel).id
        }
    }

    CartService.addLineItem(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.removeLineItem = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.removeLineItem(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.setShippingAddress = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.setShippingAddress(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.setBillingAddress = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.setBillingAddress(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.setShippingMethod = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.setShippingMethod(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.changeLineItemQuantity = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.changeLineItemQuantity(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.addDiscountCode = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.addDiscountCode(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.createOrder = function (req, res) {
    var cartId = req.param('cartId'),
        version = parseInt(req.param('version')),
        payload = req.body;

    CartService.createOrder(cartId, version, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.redirect('/#!/orders/' + result.id)
        }
    });
};
