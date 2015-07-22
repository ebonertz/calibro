'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', 'ProductUtils', '$location', 'LoggerServices', 'Cart', '$stateParams', 'OrderService',
    function ($scope, Authentication, CartService, $rootScope, ProductUtils, $location, LoggerServices, Cart, $stateParams, OrderService) {
        $scope.$utils = ProductUtils;
        $scope.authentication = Authentication;
        $scope.isCheckout = $location.path().indexOf('checkout') > -1;

        $scope.proceedToCheckout = function () {
            if ($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0)
                $location.path('/checkout');
        }

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
        };

        $scope.addDiscountCode = function (code) {
            if (code != null) {

                $rootScope.loading = true;
                CartService.addDiscountCode($rootScope.cart.id, $rootScope.cart.version, {
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
            CartService.changeLineItemQuantity($rootScope.cart.id, $rootScope.cart.version, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            }, function (error) {
                item.quantity--;
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });
        }

        $scope.decreaseLineItemQuantity = function (item) {
            item.quantity--;
            $rootScope.loading = true;
            CartService.changeLineItemQuantity($rootScope.cart.id, $rootScope.cart.version, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            }, function (error) {
                item.quantity++;
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });
        }

        // Find existing Product
        $scope.findOne = function () {
            Cart.get({
                productId: $stateParams.productId
            }, function (data) {
                $scope.cart = data;
            });
        };

        $scope.placeOrder = function () {
            OrderService.fromPaypal($rootScope.cart.id, $rootScope.cart.version);
        };


    }
]);
