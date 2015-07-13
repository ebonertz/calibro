'use strict';
var CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    PrescriptionService = require('../services/sphere/sphere.prescriptions.server.service.js');

exports.create = function (req, res) {
    var cartId = req.param('cartId'),
        contents = req.body;

    delete contents._id

    PrescriptionService.create(cartId, contents, 'cart', function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byCart = function (req, res) {
    var cartId = req.param('cartId');

    PrescriptionService.byId(cartId, function(err, result){
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    })
}
