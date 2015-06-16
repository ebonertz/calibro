'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', 'ProductUtils', '$location',
    function ($scope, Authentication, CartService, $rootScope, ProductUtils, $location) {
        $scope.$utils = ProductUtils;
        $scope.authentication = Authentication;

        $scope.proceedToCheckout = function() {
            if($rootScope.cart.lineItems != null && $rootScope.cart.lineItems > 0)
                $location.path('/checkout');
        }

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
        };

        $scope.addDiscountCode = function (code) {
            if (code != null) {
                CartService.addDiscountCode($rootScope.cart.id, {
                    code: code
                }).then(function (result) {
                    $rootScope.cart = result;
                });
            }

        }

        $scope.increaseLineItemQuantity = function (item) {
            item.quantity++;
            CartService.changeLineItemQuantity($rootScope.cart.id, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
            });
        }

        $scope.decreaseLineItemQuantity = function (item) {
            item.quantity--;
            CartService.changeLineItemQuantity($rootScope.cart.id, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
            });
        }


    }
]);
