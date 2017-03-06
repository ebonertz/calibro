'use strict';

var Promise = require('promise'),
    _ = require ('lodash'),
    SphereClient = require('../../clients/sphere.server.client.js');

var categories = [];
var chanById = {};
var chanByKey = {};
var channels = [];
var lastFetchTime;

module.exports = function (app) {
    var service = {};
    var CommonService = require('./sphere.commonsasync.server.service.js').bind({entity: 'channels'})(app);

    service.getCommonService = function() {
      return CommonService;
    }

    service.list = function () {
      return service.getCommonService().all();
    }

    service.byKey = function(key) {
      return service.getCommonService().findOne('key="' + key + '"');
    }

    service.byId = CommonService.byId;
    
    return service;
}
