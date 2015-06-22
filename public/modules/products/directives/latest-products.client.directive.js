'use strict';

var module = angular.module('products');

module.directive('latestProducts', ['ProductService', function (ProductService) {
    return {
        templateUrl: 'modules/products/templates/latest-products.client.template.html',
        restrict: 'E',
        scope: {
            category: '@',
            gender: '@',
            length: '@'
        },
        replace: true,
        link: function($scope){
            $scope.sort = {}
            $scope.pageSize = $scope.length || 4;

            $scope.products = []

            ProductService.getByCategorySlug($scope.category, {gender: $scope.gender}, {}, $scope.sort, {}, $scope.pageSize, 1).then(function(resultsArray){
                if(resultsArray.products.length > 0){
                    $scope.products = resultsArray.products
                }
            })
        }
    }
}])
