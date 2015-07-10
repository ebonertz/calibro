'use strict';
var CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    container = 'cartPrescriptions';

exports.create = function (req, res) {
    var cartId = req.param('cartId'),
        contents = req.body;

    delete contents._id;
    var value = contents;
    console.log(req.body)

    CustomObjectService.create(container, cartId, value, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byCart = function (req, res) {
    var cartId = req.param('cartId');

    CustomObjectService.find(container, cartId, function(err, result){
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    })
}
