'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', 'ProductUtils', '$location', 'LoggerServices',
    function ($scope, Authentication, CartService, $rootScope, ProductUtils, $location, LoggerServices) {
        $scope.$utils = ProductUtils;
        $scope.authentication = Authentication;

        $scope.proceedToCheckout = function() {
            if($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0)
                $location.path('/checkout');
        }

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
        };

        $scope.addDiscountCode = function (code) {
            if (code != null) {

                $rootScope.loading = true;
                CartService.addDiscountCode($rootScope.cart.id, {
                    code: code
                }).then(function (result) {
                    $rootScope.cart = result;
                    $rootScope.loading = false;
                    LoggerServices.success('Discount applied.');
                }, function (error) {
                    $rootScope.loading = false;
                    LoggerServices.warning(error);
                });
            }

        }

        $scope.increaseLineItemQuantity = function (item) {
            item.quantity++;
            $rootScope.loading = true;
            CartService.changeLineItemQuantity($rootScope.cart.id, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            });
        }

        $scope.decreaseLineItemQuantity = function (item) {
            item.quantity--;
            $rootScope.loading = true;
            CartService.changeLineItemQuantity($rootScope.cart.id, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            });
        }


    }
]);
