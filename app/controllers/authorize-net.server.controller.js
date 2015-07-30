var AuthorizeNetService = require('../services/authorize-net.server.service.js'),
    config = require('../../config/config'),
    fs = require('fs');

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

    AuthorizeNetService.relay(receipt, function (err, html) {
        if (err) {
            fs.readFile('app/views/authorize-net-scripts/redirect.server.view.html', 'utf8', function (err, data) {
                if (err) {
                    res.send(400);
                }
                var html = data.replace("%", (config.serverPath + config.payments.errorUrl));
                res.send(html);

            });
        } else {
            return res.send(html);
        }
    });

};
