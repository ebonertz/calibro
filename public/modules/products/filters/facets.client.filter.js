'use strict';

angular.module('products').filter('facets', function(){
  return function(input){
    if(terms.hasOwnProperty(input)){
      return terms[input]
    }
  }
});

// Should get the enum locale'd labels, that's what they're for
var terms = {
  // frameShape
  "SQUARE": "Square",
  "ROUND": "Round",
  "RECTANGLE": "Rectangle",

  // Width
  "NARROW": "Narrow",
  "WIDE": "Wide",
  "MEDIUM": "Medium"
}