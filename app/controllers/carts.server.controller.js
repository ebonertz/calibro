var CartService = require('../services/sphere/sphere.carts.server.service.js');


/**
 * List
 */
exports.list = function (req, res) {
    CartService.list(function (err, resultArray) {
        if (err) {
            return res.status(400);
        } else {
            res.json(resultArray);
        }
    });
};

exports.create = function (req, res) {
    var cart = req.body;

    CartService.create(cart, function (err, result) {
        if (err) {
            return res.status(400);
        } else {
            res.json(result);
        }
    });
};

exports.byId = function (req, res) {
    var id = req.param('cartId');

    CartService.byId(id, function (err, result) {
        if (err) {
            return res.status(400);
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
            return res.status(400);
        } else {
            res.json(result);
        }
    });
};

/**
 * authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    next();
};
