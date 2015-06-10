'use strict';

var LANG = 'en',
    currencyCodeMap = {EUR: '€',
                       USD: '$'}

angular.module('products').factory('ProductUtils', [
  function(){
    return {
      renderPrice: function(prices, currencyCode, country){
        var price;
        if(prices.hasOwnProperty(currencyCode+'-'+country)){
          price = prices[currencyCode+'-'+country]
        }else if(prices.hasOwnProperty(currencyCode)){
          price = prices[currencyCode]
        }else{
          return new Error("No price with that currency.")
        }

        var amount = (price.centAmount/100).toFixed(2)
        var result;

        result = amount+ currencyCodeMap[price.currencyCode]

        return result;
      },

      toPriceString: function(price){
          if(price == null)
            return '?';

          if(price.value != null)
              return currencyCodeMap[price.value.currencyCode] + ' ' + ((price.value.centAmount/100).toFixed(2));
          else
              return currencyCodeMap[price.currencyCode] + ' ' + ((price.centAmount/100).toFixed(2));

      },
       getCurrencySimbol: function(currencyCode){
            return currencyCodeMap[currencyCode];
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

        return key;
      }
    }
  }
]);
