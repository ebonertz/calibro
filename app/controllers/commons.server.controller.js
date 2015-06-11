var CommonService = require('../services/sphere/sphere.commons.server.service.js'),
    OptileService = require('../services/optile.server.service.js');

exports.list = function (req, res) {
    //OptileService.list();
    CommonService.list(this.entity, function (err, resultArray) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(resultArray);
        }
    });
};

exports.create = function (req, res) {
    var cart = req.body;

    CommonService.create(this.entity, cart, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byCustomer = function (req, res) {
    var customerId = req.param('customerId');

    CommonService.byCustomer(this.entity, customerId, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byId = function (req, res) {
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

exports.delete = function (req, res) {
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

exports.deleteAll = function (req, res) {

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
exports.hasAuthorization = function (req, res, next) {
    next();
};
