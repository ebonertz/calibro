module.exports = function (app) {
    var controller = {};
    var OptileService = require('../services/optile.server.service.js')(app);

    controller.list = function (req, res) {
        var body = req.body;

        OptileService.list(body.country, body.customer, body.payment, function(err, data) {

            if(err) {
                res.sendStatus(400);
            } else {
                res.json(data);
            }

        });



    };

    controller.return = function (req, res) {

    };

    controller.cancel = function (req, res) {

    };

    controller.notification = function (req, res) {

    };

    return controller;
}

