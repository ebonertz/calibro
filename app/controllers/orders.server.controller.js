var OrderService = require('../services/sphere/sphere.orders.server.service.js'),
    ShipstationService = require('../services/shipstation.server.service.js');

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

exports.payOrder = function (req, res) {
    var orderId = req.param('orderId'),
        payload = req.body;

    OrderService.payOrder(orderId, payload, function (err, result) {
        if (err) {
            return res.status(400).send(err.body.message);
        } else {

            // Call Shipping service

            res.redirect('/#!/orders/' + result.id)
        }
    });
};

exports.ship = function(req, res){
    ShipstationService.ship(function(err, result){
        if(err){
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
}

