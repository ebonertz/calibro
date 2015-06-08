'use strict';

var _ = require('lodash');

/**
 * Post filter for products.
 * Changes masterVariant if they don't comply with query. 
 * Attributes to filter by: frameColor, lensColor
 *
 */
var filterBy = ['frameColor', 'lensColor']

exports.variantDisplay = function(products, requestParams){
  if(!products)
    return

  // Get the filters we need
  var filters = {}
  filterBy.forEach(function(filterName){
    var value = requestParams.getFilter(filterName) || requestParams.getByQuery(filterName)
    if(value)
      filters[filterName] = value
  })

  // Stop if there are no filter to use
  if(Object.keys(filters).length == 0){
    return products
  }

  products = _.map(products, function(p){

    // Check if masterVariant complies
    var complies = true;
    _.forEach(filters, function(valueArray, key){
      
      // Check all possible values in the filter
      if(!_.contains(valueArray, p.masterVariant.attr[key]['key'])){
        complies = false;
      }
    })

    if(complies){
      p.displayVariant = p.masterVariant;
    }else{
      // Look for another variant that complies
      var found = false;
      for(var i = 0; i < p.variants.length && !found; i++){
        _.forEach(filters, function(valueArray, key){  
          if(_.contains(valueArray, p.variants[i].attr[key]['key'])){
            found = true;
          }else{
            found = false;
          }

          if(found){
            p.displayVariant = p.variants[i];
          }
        })
      }
    }

    return p;
  })

  return products;
}