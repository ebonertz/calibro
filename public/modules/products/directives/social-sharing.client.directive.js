'use strict';

var module = angular.module('products');

module.directive('socialSharing', [function() {
    return {
        templateUrl: 'modules/products/templates/social-sharing.client.template.html',
        restrict: 'EA',
        replace: true,
        ling: function($scope){
            twttr.widgets.load()
        }
    }
}])
