'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService', 'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'ProductUtils', 'Cart', 'AuthorizeNetService', 'ShippingMethodService',
    function ($scope, Authentication, $rootScope, CartService, ShippingMethods, Order, $location, Addresses, LoggerServices, ProductUtils, Cart, AuthorizeNetService, ShippingMethodService) {

        $scope.shippingMethodClass = 'disabled';
        $scope.reviewOrderClass = 'disabled';

        var init = function () {
            if ($rootScope.cart != null) {
                if ($rootScope.cart.shippingAddress != null) {
                    $scope.shippingMethodClass = 'active';

                    if (Authentication.user.addresses != null && Authentication.user.addresses.length > 0) {
                        for (var i = 0; i < Authentication.user.addresses.length; i++) {
                            if ($rootScope.cart.shippingAddress.streetName == Authentication.user.addresses[i].streetName &&
                                $rootScope.cart.shippingAddress.streetNumber == Authentication.user.addresses[i].streetNumber &&
                                $rootScope.cart.shippingAddress.firstName == Authentication.user.addresses[i].firstName &&
                                $rootScope.cart.shippingAddress.lastName == Authentication.user.addresses[i].lastName) {
                                Authentication.user.addresses[i].selected = true;
                            }
                        }

                    }

                    ShippingMethodService.byLocationOneCurrency('US', null, 'USD').then(function(data) {
                        $scope.shippingMethods = data;

                        if ($rootScope.cart.shippingInfo != null) {
                            AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                                $scope.authorizeNet = data;

                                for (var i = 0; i < $scope.shippingMethods.length; i++) {
                                    if ($scope.shippingMethods[i].name == $rootScope.cart.shippingInfo.shippingMethodName) {
                                        $scope.shippingMethods[i].selected = true;
                                    }
                                }
                                $scope.shippingMethodClass = 'active';
                                $scope.reviewOrderClass = 'active';

                                if (!$scope.$$phase)
                                    $scope.$apply();

                            });
                        }

                    });

                    if (!$scope.$$phase)
                        $scope.$apply();

                }

            } else {
                console.log("Cart is still null. Loading delay?");
            }
        }

        if ($rootScope.cart == null) {
            setTimeout(function () {
                init();
            }, 4000);
        } else {
            init();
        }


        $scope.authentication = Authentication;
        $scope.$utils = ProductUtils;

        $scope.selectShippingAddress = function (shippingAddress) {
            $scope.selectedShippingAddress = shippingAddress;
            $rootScope.cart.shippingAddress = shippingAddress;
        }

        $scope.selectShippingMethod = function (shippingMethod) {
            $scope.selectedShippingMethod = shippingMethod;
        }

        $scope.setShippingAddress = function (shippingAddress) {
            var finalShippingAddress = shippingAddress;

            if ($scope.selectedShippingAddress) {
                finalShippingAddress = $scope.selectedShippingAddress;
            }

            CartService.setShippingAddress($rootScope.cart.id, {address: finalShippingAddress}).then(function (result) {
                $rootScope.cart = result;
                $scope.shippingMethodClass = 'active';

                ShippingMethodService.byLocationOneCurrency('US', null, 'USD').then(function(data) {
                    $scope.shippingMethods = data;
                });

                //optileList();
            });
        }

        $scope.setShippingMethod = function () {
            if ($scope.selectedShippingMethod) {
                CartService.setShippingMethod($rootScope.cart.id, {
                    shippingMethod: {
                        id: $scope.selectedShippingMethod.id,
                        typeId: "shipping-method"
                    }
                }).then(function (result) {
                    $rootScope.cart = result;
                    $scope.reviewOrderClass = 'active';

                    AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                        $scope.authorizeNet = data;
                    });
                });

            }
        }

        /*        var optileList = function () {
         OptileService.list($rootScope.cart.shippingAddress.country,
         {email: Authentication.user.email},
         {
         amount: $rootScope.cart.taxedPrice.totalNet.centAmount / 100,
         currency: $rootScope.cart.taxedPrice.totalNet.currencyCode,
         reference: $rootScope.cart.id
         }).then(function (listUrl) {
         $('#paymentNetworks').checkoutList(
         {
         payButton: "submitBtn",
         listUrl: listUrl,
         smartSwitch: true
         }
         );
         });
         }
         */

        $scope.createOrder = function () {
            var order = new Order({
                id: $rootScope.cart.id,
                version: $rootScope.cart.version
            });

            order.$save(function (response) {
                console.log('Order created.');
                $('#authorizeNetForm').submit();
            }, function (errorResponse) {
                console.log(errorResponse);
            });
        }


        $scope.addCustomerAddress = function (address, valid) {
            console.log(valid);

            var address = new Addresses(address);

            address.$save(function (response) {
                Authentication.user = response;
                console.log("success address");
            }, function (response) {
                $scope.error = response.data.message;
            });

        };

    }
])
;
