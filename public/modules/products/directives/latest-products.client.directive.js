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
            var filters = {};
            if ($scope.gender) {
                filters.gender = {
                    value: "\""+$scope.gender.toUpperCase()+"\"",
                    isText: false
                };
            }

            ProductService.listBy($scope.category, undefined, filters, 1, $scope.pageSize, 'name.en', true).then(function (results) {
                if (results.data.products.length > 0) {
                    $scope.products = results.data.products;

                }
            });
        }
    }
}])
