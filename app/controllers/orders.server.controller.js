var OrderService = require('../services/sphere/sphere.orders.server.service.js');

exports.payOrder = function (req, res) {
    var orderId = req.param('orderId'),
        payload = req.body;

    OrderService.payOrder(orderId, payload, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.redirect('/#!/orders/' + result.id)
        }
    });
};

