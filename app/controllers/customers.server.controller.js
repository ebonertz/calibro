var CustomerService = require('../services/customers.sphere.server.service.js');

/**
 * List
 */
exports.list = function (req, res) {
    CustomerService.list(function (err, resultArray) {
        if (err) {
            return res.status(400);
        } else {
            res.json(resultArray);
        }
    });
};

exports.create = function (req, res) {
    var customer = req.body;

    CustomerService.create(customer, function (err, result) {
        if (err) {
            return res.status(400);
        } else {
            res.json(result);
        }
    });
};

exports.login = function (req, res) {
    var customer = req.body;

    CustomerService.login(customer, function (err, result) {
        if (err) {
            return res.status(400);
        } else {
            res.json(result);
        }
    });
};


/**
 *  authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    next();
};
