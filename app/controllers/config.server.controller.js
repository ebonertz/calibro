var config = require('../../config/config');
module.exports = function (app) {
  var controller = {};


  controller.get = function (req, res) {
    res.json({
      description: req.app.locals.description,
      title: req.app.locals.title
    });
  }
  return controller;
}


