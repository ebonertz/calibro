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

exports.help = function (req, res) {
    ContentfulService.help(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.eyewear = function (req, res) {
    ContentfulService.eyewear(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.sunglasses = function (req, res) {
    ContentfulService.sunglasses(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.menSummer = function (req, res) {
    ContentfulService.menSummer(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.womenSummer = function (req, res) {
    ContentfulService.womenSummer(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byTypeAndName = function (req, res) {
    var type = req.query.type;
    var name = req.query.name;
    ContentfulService.byTypeAndName(type, name, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};
