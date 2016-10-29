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
        if(price.value){
            price = price.value
        }
        var totalLinePrice = angular.copy(price);
        totalLinePrice.centAmount = totalLinePrice.centAmount * times;
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
});

angular.module('core').filter('priceMath', function(){
    return function(firstPrice, secondPrice, op){
        var price = angular.copy(firstPrice);
        switch(op){
            case '+':
                price.centAmount += secondPrice.centAmount;
                break;
            case '-':
                price.centAmount -= secondPrice.centAmount;
                break;
        }

        return price
    }
})

angular.module('core').filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
            input.push(i);
        return input;
    };
});

angular.module('core').filter('size', function () {
    return function (input, size) {

        if (input) {

            var dotIndex = input.lastIndexOf('.'),
                fileName = input.substring(0, dotIndex),
                fileExtention = input.substring(dotIndex, input.length);

            input = fileName + '-' + size + fileExtention;

        }
        return input;
    };
});

angular.module('core').filter('sumTaxes', function(){
    return function(taxedPrice){
        var totalTaxes = {
            currencyCode: taxedPrice.taxPortions[0].amount.currencyCode,
            centAmount: 0,
        };
        for(var i in taxedPrice.taxPortions){
            totalTaxes.centAmount += taxedPrice.taxPortions[i].amount.centAmount
        }
        return totalTaxes;
    }
});
