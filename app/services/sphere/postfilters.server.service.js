'use strict';

var _ = require('lodash');

/**
 * Post filter for products.
 * Changes masterVariant if they don't comply with query. 
 * Attributes to filter by: frameColor, lensColor, price
 *
 */
var filterBy = ['frameColor', 'lensColor', 'price']

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
      
      if(key === 'price'){
        // _At least one_ of the prices has to comply to be true
        // Other filters must comply with _all_ values
        var price_comply = false;

        for(var priceKey in p.masterVariant.prices){
          if(p.masterVariant.prices.hasOwnProperty(priceKey)){
            var price = p.masterVariant.prices[priceKey].centAmount
            if(price >= valueArray.min && price <= valueArray.max){
              price_comply = true;
            }
          }
        }

        complies = price_comply;
      }else{
        // Check all possible values in the filter
        if(!_.contains(valueArray, p.masterVariant.attr[key]['key'])){
          complies = false;
        }
      }
    })

    if(complies){
      p.displayVariant = p.masterVariant;
    }else{
      // Look for another variant that complies
      var found;
      for(var i = 0; i < p.variants.length && !found; i++){
        found = true;
        _.forEach(filters, function(valueArray, key){

          if(key === 'price'){
            // _At least one_ of the prices has to comply to be true
            // Other filters must comply with _all_ values
            var price_comply = false; 
            for(var priceKey in p.variants[i].prices){
              if(p.variants[i].prices.hasOwnProperty(priceKey)){
                var price = p.variants[i].prices[priceKey].centAmount
                if(price >= valueArray.min && price <= valueArray.max){
                  price_comply = true;
                }
              }
            }
                
            found = price_comply;
          }else{
            if(!_.contains(valueArray, p.variants[i].attr[key]['key'])){
              found = false;
            }
          }
        })

        if(found){
          p.displayVariant = p.variants[i];
        }
      }
    }

    return p;
  })

  return products;
}