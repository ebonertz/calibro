'use strict';

var currencyCodeMap = {
  EUR: '€',
  USD: '$'
}

angular.module('products').filter('facets', function(){
  return function(input){
    if(terms.hasOwnProperty(input)){
      return terms[input]
    }else{
      return input
    }
  }
})

// Move to commons
.filter('spherePrice', function(){
  return function(price){

    if(!price)
      return

    var amount = (price.centAmount/100).toFixed(2)
    var result;

    switch(price.currencyCode){
      case "EUR":
        result = amount + currencyCodeMap[price.currencyCode]
        break;
      case "USD":
        result = currencyCodeMap[price.currencyCode] + amount
    }

    return result;
  }
})

.filter('sphereDate', function(){
  return function(input){
      return new Date(Date.parse(input))
  }
})

.filter('localeDate', function(){
  return function(input){
      return input.toLocaleDateString()
  }
})

.filter('capitalizeFirst', function(){
    return function(input){
        if(!input)
            return
        else
            return input.charAt(0).toUpperCase() + input.slice(1);
    }
})

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
