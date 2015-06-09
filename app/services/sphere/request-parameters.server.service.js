'use strict';

var _ = require('lodash');

var RequestParameters = function(query){

  var requestparams = this
  requestparams._facets = []
  requestparams._byQueries = {}
  requestparams._filters = {}
  requestparams._sorts = {}

  if(query.byQuery){
    _.forEach(query.byQuery.split(";"), function(key){
      requestparams._byQueries[key] = true
    })
  }

  _.forEach(query, function(value, key){
    if(key == "facets"){
      requestparams._facets = value.split(";")      
    }else if(key == "sort"){
      var sorts = value.split(";")
      
      for(var i = 0; i < sorts.length; i++){
        var sortSplit = sorts[i].split(":")
        var ascending = sortSplit[1].toUpperCase()

        if(ascending == "ASC"){
          ascending = true
        } else if (ascending == "DESC"){
          ascending = false
        } else {
          console.warn('No direction for sort, received '+ascending)
          continue;
        }

        requestparams._sorts[sortSplit[0]] = ascending;
      }
        
    }else if(key != "byQuery"){ 
      if(requestparams._byQueries.hasOwnProperty(key)){
        requestparams._byQueries[key] = value.split(";")
      }else{
        requestparams._filters[key] = value.split(";")
      }      
    }
  })

  // Maybe extend Sphere queries insted of using this object
  this.addFilters = function(sphereQuery){
    _.forEach(requestparams._filters, function(valueArray, key){
      console.log('.filter('+requestparams._toSphereString(key, valueArray)+')')
      sphereQuery = sphereQuery.filter(requestparams._toSphereString(key, valueArray))
    })
    return sphereQuery
  }
  this.addByQueries = function(sphereQuery){
    _.forEach(requestparams._byQueries, function(valueArray, key){
      console.log('.filterByQuery('+requestparams._toSphereString(key, valueArray)+')')
      sphereQuery = sphereQuery.filterByQuery(requestparams._toSphereString(key, valueArray))
    })
    return sphereQuery
  }
  this.addFacets = function(sphereQuery){
    _.forEach(requestparams._facets, function(value){
      console.log('.facet('+requestparams._toSphereString(value)+')')
      sphereQuery = sphereQuery.facet(requestparams._toSphereString(value))
    })
    return sphereQuery
  }
  this.addSorts = function(sphereQuery){
    _.forEach(requestparams._sorts, function(value, key){
      console.log('.sort('+requestparams._toSphereString(key)+','+value.toString()+')')
      sphereQuery = sphereQuery.sort(requestparams._toSphereString(key), value)
    })
    return sphereQuery
  }

  // TODO
  this.getPageSize = function(){}


  this.getFilter = function(filterName){
    if(requestparams._filters.hasOwnProperty(filterName)){
      return requestparams._filters[filterName]
    }else{
      return null
    }
  }

  this.getByQuery = function(filterName){
    if(requestparams._byQueries.hasOwnProperty(filterName)){
      return requestparams._byQueries[filterName]
    }else{
      return null
    }
  }

  this._toSphereString = function(key, valueArray){
    var query = sphereKeys[key]

    if(valueArray){
      var is_enum = (sphereKeys[key].slice(-3) == "key")
      var values = (is_enum ? valueArray.join('","').toUpperCase() : valueArray.join('","'))

      query = query +':"'+ values +'"'
    }
    return query
  }
}

// TODO: Move to config/constants
var sphereKeys = {
  sex: "variants.attributes.sex.key",
  width: "variants.attributes.width.key",
  frameShape: "variants.attributes.frameShape.key",
  frameMaterial: "variants.attributes.frameMaterial.en",
  lensColor: "variants.attributes.lensColor.key",
  frameColor: "variants.attributes.frameColor.key",
  name: "name.en",
  price: "price"
}


module.exports = RequestParameters;