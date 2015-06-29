'use strict';

var LOCALE = 'en';

angular.module('core').filter('locale', function(){
    return function(input){
        if(input)
            return input[LOCALE];
        else
            return ''
    }
})
