'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope',
    function ($scope, Authentication, CartService, $rootScope) {
        $scope.authentication = Authentication;

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
        };

        $scope.increaseLineItemQuantity = function (item) {
            item.quantity++;
            CartService.changeLineItemQuantity($rootScope.cart.id, {lineItemId: item.id, quantity: item.quantity}).then(function(result) {
                $rootScope.cart = result;
            });
        }

        $scope.decreaseLineItemQuantity = function (item) {
            item.quantity--;
            CartService.changeLineItemQuantity($rootScope.cart.id, {lineItemId: item.id, quantity: item.quantity}).then(function(result) {
                $rootScope.cart = result;
            });
        }


    }
]);
