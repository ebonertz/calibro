var CustomerService = require('../services/sphere/sphere.customers.server.service.js');
var User = require('../models/sphere/sphere.user.server.model.js');

/**
 * List
 */
 exports.list = function (req, res) {
  CustomerService.list(function (err, resultArray) {
    if (err) {
      return res.status(400);
    }

    return res.json(resultArray);
  });
};

exports.create = function (req, res) {
  var customer = req.body;

  CustomerService.create(customer, function (err, result) {
    if (err) {
      return res.status(400);
    } else {
      res.json(result.body.customer);
    }
  });
};

exports.login = function (req, res) {
  var email, password;

  email = req.body.email;
  password = req.body.password;

  if(typeof email === "undefined" || typeof password === "undefined" || email.length < 1 || password.length < 1){
    return res.status(400);
  }

  CustomerService.login(email, password, function (err, result) {
    if (err) {
      return res.status(400);
    } else {
      // res.json(result);
      if(result.body && typeof result !== 'undefined')
        return res.json(result);
      else
        return res.status(503);
    }
  });
};

exports.findOne = function(req, res){
  var id;

  id = req.params.id;

  User.findById(id, function(err, result){
    if (err) {
      return res.status(400);
    } else {
      // res.json(result);
      if(result && typeof result !== 'undefined')
        return res.json(result);
      else
        return res.status(503);
    }
  });
}

/**
 *  authorization middleware
 */
 exports.hasAuthorization = function (req, res, next) {
  next();
};
