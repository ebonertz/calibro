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
    console.log('Query');
    console.log(req.query);
    console.log('Body');
    console.log(req.body);
    return res.sendStatus(200);
};
