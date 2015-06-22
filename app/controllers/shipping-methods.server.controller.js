var ShippingMethodService = require('../services/sphere/sphere.shipping-methods.server.service.js');

exports.byCart = function (req, res) {
    var cartId = req.param('cartId');

    ShippingMethodService.byCart(cartId, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            if (result.errors != null && result.errors.length > 0) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }

        }
    });
};

exports.byLocation = function (req, res) {
    var country = req.query.country,
        state = req.query.state,
        currency = req.query.currency;

    ShippingMethodService.byLocation(country, state, currency, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            if (result.errors != null && result.errors.length > 0) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }

        }
    });
};

exports.byLocationOneCurrency = function (req, res) {
    var country = req.query.country,
        state = req.query.state,
        currency = req.query.currency;

    ShippingMethodService.byLocationOneCurrency(country, state, currency, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            if (result.errors != null && result.errors.length > 0) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }

        }
    });
};
