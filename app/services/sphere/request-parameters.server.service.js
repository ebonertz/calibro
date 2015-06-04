'use strict';

var _ = require('lodash');

var RequestParameters = function(query){

  var requestparams = this
  requestparams._facets = []
  requestparams._byQueries = {}
  requestparams._filters = {}
  requestparams._sort = {}

  

  if(query.byQuery){
    _.forEach(query.byQuery.split(";"), function(key){
      requestparams._byQueries[key] = true
    })
  }

  _.forEach(query, function(value, key){
    if(key == "facets"){
      requestparams._facets = value.split(";")      
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
      // console.log('.filter('+requestparams._toSphereString(key, valueArray)+')')
      sphereQuery = sphereQuery.filter(requestparams._toSphereString(key, valueArray))
    })
    return sphereQuery
  }
  this.addByQueries = function(sphereQuery){
    _.forEach(requestparams._byQueries, function(valueArray, key){
      // console.log('.filterByQuery('+requestparams._toSphereString(key, valueArray)+')')
      sphereQuery = sphereQuery.filterByQuery(requestparams._toSphereString(key, valueArray))
    })
    return sphereQuery
  }
  this.addFacets = function(sphereQuery){
    _.forEach(requestparams._facets, function(value){
      // console.log('.facet('+requestparams._toSphereString(value)+')')
      sphereQuery = sphereQuery.facet(requestparams._toSphereString(value))
    })
    return sphereQuery
  }

  // TODO
  this.getSort = function(){}
  this.getPageSize = function(){}

  this._toSphereString = function(key, valueArray){
    var query = sphereKeys[key]
    if(valueArray){
      query = query +':"'+ valueArray.join('","').toUpperCase()+'"'
    }
    return query
  }
}

// TODO: Move to config/constants
var sphereKeys = {
  sex: "variants.attributes.sex.key",
  width: "variants.attributes.width.key",
  frameShape: "variants.attributes.frameShape.key"
}


module.exports = RequestParameters;