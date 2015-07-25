var PaypalService = require('../services/paypal.server.service.js'),
    config = require('../../config/config');

exports.setExpressCheckout = function (req, res) {
    var amount = req.query.amount,
        currencyCode = req.query.currency,
        cartId = req.query.cart;

    PaypalService.setExpressCheckout(currencyCode, amount, cartId, function (err, data) {
        if (err) {
            console.log(err);
            res.sendStatus(400);
        } else {
            var redirectUrl = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=' + data.TOKEN;
            res.send(redirectUrl);
        }
    });

};


exports.success = function (req, res) {
    var token = req.query.token,
        payerId = req.query.PayerID,
        cartId = req.query.cart;

    PaypalService.getExpressCheckoutDetails(token, cartId, function (err, data) {
        if (err) {
            res.redirect(config.payments.errorUrl);
        } else {
            console.log(data);
            res.redirect('/#!/carts/' + cartId);
        }
    });
};

exports.cancel = function (req, res) {
    var cartId = req.query.cart;
    res.redirect(config.payments.errorUrl);
};
