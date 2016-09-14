'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', '$location', 'LoggerServices', 'Cart', '$stateParams', 'OrderService','ipCookie',
    function ($scope, Authentication, CartService, $rootScope, $location, LoggerServices, Cart, $stateParams, OrderService,ipCookie) {
        $scope.authentication = Authentication;
        $scope.isCheckout = $location.path().indexOf('checkout') > -1;

        var init = function () {
            $rootScope.cart.totalDiscount = CartService.calculateDiscountCode($rootScope.cart);

        };

        if ($rootScope.cart == null) {
            var cartWatch = $rootScope.$watch('cart', function (cart) {
                if (cart != null) {
                    cartWatch()
                    init();
                }
            })
        } else {
            init();
        }



        $scope.proceedToCheckout = function () {
            if ($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0) {
                var cookieId = null;
                if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
                    cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
                }
                if (!Authentication.user && cookieId) {
                    CartService.refreshCart(cookieId).then(function (cart) {
                        $rootScope.cart = cart;
                        $location.path('/checkout');
                    });
                }
                else {
                    $location.path('/checkout');
                }


            }

        }

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
            $rootScope.cart.totalDiscount = CartService.calculateDiscountCode($rootScope.cart);

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
                    $rootScope.cart.totalDiscount = CartService.calculateDiscountCode($rootScope.cart);

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
                $rootScope.cart.totalDiscount = CartService.calculateDiscountCode($rootScope.cart);

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
                $rootScope.cart.totalDiscount = CartService.calculateDiscountCode($rootScope.cart);

            }, function (error) {
                item.quantity++;
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });
        }

        $scope.findOne = function () {
            Cart.get({
                cartId: $stateParams.id
            }, function (data) {
                $scope.cart = data;
            });
        };


    }
]);
