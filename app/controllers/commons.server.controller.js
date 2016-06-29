
module.exports = function (app) {
    var CommonService = require('../services/sphere/sphere.commons.server.service.js')(app);
    var controller = {};
    controller.list = function (req, res) {
        CommonService.list(this.entity, function (err, resultArray) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(resultArray);
            }
        });
    };

    controller.create = function (req, res) {
        var cart = req.body;

        CommonService.create(this.entity, cart, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.byCustomer = function (req, res) {
        var customerId = req.param('customerId');

        CommonService.byCustomer(this.entity, customerId, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.byCustomerOwn = function (req, res) {
        var customerId = req.user.id;

        if(!customerId)
            return res.sendStatus(400);

        CommonService.byCustomer(this.entity, customerId, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.byId = function (req, res) {
        var id = req.param('id');

        if (!id)
            return res.sendStatus(400);

        CommonService.byId(this.entity, id, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.delete = function (req, res) {
        var id = req.param('id');

        if (!id)
            return res.sendStatus(400);

        CommonService.delete(this.entity, id, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.deleteAll = function (req, res) {

        CommonService.deleteAll(this.entity, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    /**
     * authorization middleware
     */
    controller.hasAuthorization = function (req, res, next) {
        next();
    };
return controller;
}
