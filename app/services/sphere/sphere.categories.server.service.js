'use strict';

var Promise = require('promise');


module.exports = function (app) {

  var service = {};
  var CommonService = require('./sphere.commonsasync.server.service.js').bind({entity: 'categories'})(app);

  service.byId = function(id){
    return CommonService.byId(id);
  }

  service.bySlug = function(slug){
    return CommonService.bySlug(slug);
  }

  return service;
}
