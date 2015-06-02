var OrderService = require('../services/sphere/sphere.orders.server.service.js');


/**
 * List
 */
exports.list = function (req, res) {
    OrderService.list(function (err, resultArray) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(resultArray);
        }
    });
};

exports.create = function (req, res) {
    var cart = req.body;

    OrderService.create(cart, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byCustomer = function (req, res) {
    var customerId = req.param('customerId');

    OrderService.byCustomer(customerId, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byId = function (req, res) {
    var id = req.param('orderId');

    OrderService.byId(id, function (err, result) {
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
