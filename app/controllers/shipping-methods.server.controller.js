var ShippingMethodService = require('../services/sphere/sphere.shipping-methods.server.service.js');


/**
 * List
 */
exports.list = function (req, res) {
    ShippingMethodService.list(function (err, resultArray) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(resultArray);
        }
    });
};

exports.create = function (req, res) {
    var cart = req.body;

    ShippingMethodService.create(cart, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byId = function (req, res) {
    var id = req.param('shippingMethodId');

    ShippingMethodService.byId(id, function (err, result) {
        if (err) {
            return res.sendStatus(400);
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
