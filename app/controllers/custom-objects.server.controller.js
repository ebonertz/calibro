var CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js');

exports.find = function (req, res) {
    var key = req.query.key,
        container = req.query.container;

    CustomObjectService.find(container, key, function (err, customObject) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(customObject);
        }
    });
};

