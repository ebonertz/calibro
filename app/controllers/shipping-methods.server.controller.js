module.exports = function (app) {
    var ShippingMethodService = require('../services/sphere/sphere.shipping-methods.server.service.js')(app);
    var controller = {};
    controller.byCart = function (req, res) {
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

    controller.byLocation = function (req, res) {
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

    controller.byLocationOneCurrency = function (req, res) {
        var country = req.query.country,
            state = req.query.state,
            currency = req.query.currency,
            zonename = req.query.zonename;

        ShippingMethodService.byLocationOneCurrency(country, state, currency, zonename, function (err, result) {
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

    return controller;
}
