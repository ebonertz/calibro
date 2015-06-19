var CartService = require('../services/sphere/sphere.carts.server.service.js');

exports.byCustomer = function (req, res) {
    var customerId = req.param('customerId');

    CartService.byCustomer(customerId, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.addLineItem = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.addLineItem(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.removeLineItem = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.removeLineItem(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.setShippingAddress = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.setShippingAddress(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.setBillingAddress = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.setBillingAddress(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.setShippingMethod = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.setShippingMethod(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.changeLineItemQuantity = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.changeLineItemQuantity(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.addDiscountCode = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.addDiscountCode(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.createOrder = function (req, res) {
    var cartId = req.param('cartId'),
        payload = req.body;

    CartService.createOrder(cartId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.redirect('/#!/orders/' + result.id)
        }
    });
};

