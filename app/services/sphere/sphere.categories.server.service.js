'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  CommonService = require('./sphere.commons.server.service.js');

var categories = {}

exports.getId = function(slug, callback){
  if(categories.hasOwnProperty(slug)){
    callback(null,categories[slug])
  }else{
    CommonService.getBySlug('categories', slug, function(err, result){
      
      if(err){
        callback(err)
      }else{
        var id = result.results[0]['id']
        if(id){
          categories[slug] = result.results[0].id
          callback(null, id)
        }else{
          callback(new Error("No id found for that slug"))
        }
      }        
    })
  }
}