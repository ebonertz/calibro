'use strict';

var LANG = 'en';

angular.module('products').factory('ProductUtils', [
  function(){
    return {
      renderPrice: function(variant, currencyCode, country){
        var price;
        if(variant.prices.hasOwnProperty(currencyCode+'-'+country)){
          price = variant.prices[currencyCode+'-'+country]
        }else if(variant.prices.hasOwnProperty(currencyCode)){
          price = variant.prices[currencyCode]
        }else{
          return new Error("No price with that currency.")
        }

        var amount = (price.centAmount/100).toFixed(2)
        var result;

        switch(price.currencyCode){
          case 'EUR':
            result = amount+'€'
            break;
          case 'USD':
            result = '$'+amount
            break;
        }
        return result;
      },

      attrKey: function(facetKey, attrConfig){
        var key = 'variants.attributes.'+facetKey

        switch(attrConfig.type){
          case 'lenum':
            key += ".key";
            break;
          case 'ltext':
            key += "."+LANG;
            break;
        }
        console.log(key)

        return key;
      }
    }
  }
]);