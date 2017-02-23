'use strict';

var Promise = require('promise'),
    SphereClient = require('../../clients/sphere.server.client.js'),
    _ = require('lodash');

module.exports = function (app) {
    var CommonService = require('./sphere.commons.server.service.js') (app);
    var service = {};

    service.getFirst = function(){
      return CommonService.getFirst('taxCategories')
    }

    return service;
}
