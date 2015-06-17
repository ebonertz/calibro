var ContentfulService = require('../services/contentful.server.service.js');

exports.home = function (req, res) {
    ContentfulService.home(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};
