'use strict';

var CommonService = require('./sphere.commons.server.service.js'),
    Promise = require('promise');

var LANG = 'en';

var categories = []
var catById = {}
var catBySlug = {}

exports.getId = function(slug){
  if(catBySlug.hasOwnProperty(slug)){
    return catBySlug[slug].id
  }else{
    fetchCategories().then(function(){
      if(catBySlug.hasOwnProperty(slug)){
        return catBySlug[slug].id
      }else{
        return null
      }
    })
  }
}

exports.getSlug = function(id){
  if(catById.hasOwnProperty(id)){
    return catById[id].slug[LANG]
  }else{
    fetchCategories().then(function(){
      if(catById.hasOwnProperty(id)){
        return catById[id].slug[LANG];
      }else{
        return null;
      }
    })
  }
}


var fetchCategories = function(){
  var p = new Promise(function(resolve, reject){
    CommonService.all('categories', function(err, results){
      if(err){
        console.log(err)
        reject(err)
      }else{
        categories = results;

        for(var i = 0; i < categories.length; i++){
          var cat = categories[i];
          catById[cat.id] = cat;
          catBySlug[cat.slug[LANG]] = cat;
        }

        resolve()
      }
    })
  })

  return p
}

// Run once on startup
fetchCategories();
