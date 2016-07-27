var ContentfulService = require('../services/contentful.server.service.js');
var marked = require('marked');
var _ = require ('lodash');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

function mapPropertiesToHtml(result, notProcess) {

    _.each(_.keys(result), function (key) {
        var shouldNotProcess = _.find (notProcess, function(item) {
            return item == key;
        });
        if (typeof result [key] === "string" && !shouldNotProcess) {
            result [key] = marked (result[key]);
        }
    });
    return result;
};

exports.home = function (req, res) {
    ContentfulService.home(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            var notProcessableKeys = ['heroText','heroButtonText','slide2Text','slide2ButtonText','orderEmail','orderPhone',
                'heroButtonUrl','slide2ButtonUrl','eyewearHimButtonUrl','eyewearHerButtonUrl','sunglassesHimButtonUrl','sunglassesHerButtonUrl'];
            res.json(mapPropertiesToHtml(result, notProcessableKeys));
        }
    });
};

exports.help = function (req, res) {
    ContentfulService.help(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(mapPropertiesToHtml(result));
        }
    });
};

exports.eyewear = function (req, res) {
    ContentfulService.eyewear(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(mapPropertiesToHtml(result));
        }
    });
};

exports.sunglasses = function (req, res) {
    ContentfulService.sunglasses(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(mapPropertiesToHtml(result));
        }
    });
};

exports.menSummer = function (req, res) {
    ContentfulService.menSummer(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(mapPropertiesToHtml(result));
        }
    });
};

exports.womenSummer = function (req, res) {
    ContentfulService.womenSummer(function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(mapPropertiesToHtml(result));
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
            res.json(mapPropertiesToHtml(result));
        }
    });
};
