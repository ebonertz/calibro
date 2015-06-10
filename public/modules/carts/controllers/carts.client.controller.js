'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', 'ProductUtils',
    function ($scope, Authentication, CartService, $rootScope, ProductUtils) {
        $scope.$utils = ProductUtils;
        $scope.authentication = Authentication;

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
