'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService',
    function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService) {
        $scope.authentication = Authentication;

        // Find a list of Products
        $scope.find = function () {
            ProductService.list().then(function(resultsArray) {
                $scope.products = resultsArray;
            })

        };

        // Find existing Product
        $scope.findOne = function () {
            $scope.product = Products.get({
                productId: $stateParams.productId
            });
        };

        $scope.addToCart = function (product) {
            CartService.addToCart(product);
        };

    }
]);
