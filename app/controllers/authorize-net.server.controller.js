var AuthorizeNetService = require('../services/authorize-net.server.service.js');

exports.get = function (req, res) {
    var amount = req.query.amount;

    if (amount == null) {
        res.sendStatus(400);
        return;
    }

    AuthorizeNetService.get(amount, function (err, data) {

        if (err) {
            res.sendStatus(400);
        } else {
            res.json(data);
        }

    });

};

exports.relay = function (req, res) {
    var receipt = req.body;

    if (receipt == null) {
        res.sendStatus(400);
        return;
    }

    AuthorizeNetService.authorizeCallback(receipt, function (err, orderCreated) {
        if (err) {
            return res.render('authorize-net-scripts/failure');
        } else {
            return res.render('authorize-net-scripts/success',  { orderId: orderCreated.id });
        }
    });

};
