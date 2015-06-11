var OptileService = require('../services/optile.server.service.js');

exports.list = function (req, res) {
    var body = req.body;

    OptileService.list(body.country, body.customer, body.payment, function(err, data) {

        if(err) {
            res.sendStatus(400);
        } else {
            res.json(data);
        }

    });



};

exports.return = function (req, res) {

};

exports.cancel = function (req, res) {

};

exports.notification = function (req, res) {

};
