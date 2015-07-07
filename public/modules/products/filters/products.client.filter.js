'use strict';

var currencyCodeMap = {
  EUR: '€',
  USD: '$'
};

var module = angular.module('products');

module.filter('facets', function(){
  return function(input){
    if(terms.hasOwnProperty(input)){
      return terms[input]
    }else{
      return input
    }
  }
})

// Move to commons
module.filter('spherePrice', function(){
  return function(price){

    if(!price)
      return

    if(price.hasOwnProperty('value'))
        price = price.value

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
});

// Returns an array with all the prices with the selected currency
module.filter('currency', function(appDefaults){
    return function(input, currency){
        var prices = [];

        currency = currency || appDefaults.currency;

        if(typeof input == 'object'){
            for(var key in input){
                var price = input[key];
                if (price && price.value.currencyCode == currency) {
                    prices.push(price)
                }
            }
        }

        return prices;
    }
});

module.filter('channel', function(){
    return function(input, channel){
        if(typeof input == 'object' && channel) {
            var return_price = null;
            if(typeof channel == 'string') {
                for(var key in input){
                    var price = input[key];
                    if (price && price.channel.key == channel) {
                        return_price = price;
                        break;
                    }
                }
            }

            if(!return_price) return_price = price[0];

            return return_price;
        }

        return null
    }
});

module.filter('sphereDate', function(){
  return function(input){
      return new Date(Date.parse(input))
  }
})

module.filter('localeDate', function(){
  return function(input){
      return input.toLocaleDateString()
  }
})

module.filter('label', function(){
    return function(input){
        if(!input)
            return 'N/A'
        else {
            if (input.toString() == "true") return "Yes";
            if (input.toString() == "false") return "No";
            return input.charAt(0).toUpperCase() + input.slice(1);
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
