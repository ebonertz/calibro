var config = require('../../config/config');

module.exports = function (app) {
    var OrderService = require('../services/sphere/sphere.orders.server.service.js')(app);

    var controller = {};
    controller.create = function (req, res) {
        var cart = req.body;

        OrderService.create(cart, function (err, result) {
            if (err) {
                return res.status(400).send(err.body.message);
            } else {
                res.json(result);
            }
        });
    };

    controller.byId = function (req, res) {
        var id = req.params.id;

        OrderService.byId(id).then(function (result) {
            res.json(result);
        })

    };

    return controller;
}



