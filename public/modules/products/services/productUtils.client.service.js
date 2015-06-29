'use strict';

var LANG = 'en';

angular.module('products').factory('ProductUtils', [
  function(){
    return {
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
