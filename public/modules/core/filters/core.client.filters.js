'use strict';

var LOCALE = 'en';

angular.module('core').filter('locale', function(appDefaults){
    return function(input){
        var locale = appDefaults.locale || LOCALE;
        if(input)
            return input[locale];
        else
            return ''
    }
})

angular.module('core').filter('priceTimes', function(){
    return function(price, times){
        var totalLinePrice = angular.copy(price);
        totalLinePrice.value.centAmount = totalLinePrice.value.centAmount * times;
        return totalLinePrice
    }
})

angular.module('core').filter('sumDiscounts', function(){
    return function(includedDiscounts){
        var totalLineDiscount = {
            currencyCode: includedDiscounts[0].discountedAmount.currencyCode,
            centAmount: 0,
        };
        for(var i in includedDiscounts){
            totalLineDiscount.centAmount += includedDiscounts[i].discountedAmount.centAmount
        }
        return {value: totalLineDiscount}
    }
})
