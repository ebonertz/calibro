var PaypalService = require('../services/paypal.server.service.js');

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

        } else {
            console.log(data);
            res.redirect('/#!/carts/' + cartId);
        }
    });
};

// TODO
exports.cancel = function (req, res) {
    console.log('TODO Cancel route');
};
