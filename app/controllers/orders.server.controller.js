var OrderService = require('../services/sphere/sphere.orders.server.service.js'),
    PaypalService = require('../services/paypal.server.service.js'),
    config = require('../../config/config'),
    CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js');

exports.create = function (req, res) {
    var cart = req.body;

    OrderService.create(cart, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.json(result);
        }
    });
};

exports.fromPaypal = function (req, res) {
    var cartId = req.param('cartId'),
        version = req.query.version;

    OrderService.fromPaypal(cartId, version, function (err, result) {
        if (err) {
            res.redirect(config.payments.errorUrl)
        } else {
            res.redirect('/#!/orders/' + result.id)
        }
    });


}


// TODO: Should be deleted when merge.
exports.payOrder = function (req, res) {
    var orderId = req.param('orderId'),
        payload = req.body;

    OrderService.payOrder(orderId, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {
            res.redirect('/#!/orders/' + result.id)
        }
    });
};


