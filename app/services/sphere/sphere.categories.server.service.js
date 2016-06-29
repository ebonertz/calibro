'use strict';

var Promise = require('promise');


module.exports = function (app) {
  var CommonService = require('./sphere.commons.server.service.js')(app);

  var service = {};

  var LANG = 'en';

  var categories = []
  var catById = {}
  var catBySlug = {}

  service.getId = function(slug){
    if(catBySlug[slug]){
      return catBySlug[slug].id
    }else{
      fetchCategories().then(function(){
        if(catBySlug[slug]){
          return catBySlug[slug].id
        }else{
          return null
        }
      })
    }
  }

  service.getSlug = function(id){
    if(catById[id]){
      return catById[id].slug[LANG]
    }else{
      fetchCategories().then(function(){
        if(catById[id]){
          return catById[id].slug[LANG];
        }else{
          return null;
        }
      })
    }
  }

  service.getName = function (id) {
    if (catById[id]) {
      return catById[id].name[LANG]
    } else {
      fetchCategories().then(function () {
        if (catById[id]) {
          return catById[id].name[LANG];
        } else {
          return null;
        }
      })
    }
  }

  service.getCategoryById = function (id) {
    return fetchCategories().then(function () {
      if (catById[id]) {
        return catById[id];
      } else {
        return null;
      }
    })
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
  app.logger.debug("Initializing Sphere Categories");
  fetchCategories();

  return service;
}
