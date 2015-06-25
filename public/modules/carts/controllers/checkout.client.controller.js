'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService', 'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'ProductUtils', 'Cart', 'AuthorizeNetService', 'ShippingMethodService',
    function ($scope, Authentication, $rootScope, CartService, ShippingMethods, Order, $location, Addresses, LoggerServices, ProductUtils, Cart, AuthorizeNetService, ShippingMethodService) {

        $scope.phaseA = true;
        $scope.phaseB = false;
        $scope.phaseC = false;

        var init = function () {
            if ($rootScope.cart != null) {
                if ($rootScope.cart.shippingAddress != null) {

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

                    $rootScope.loading = true;

                    ShippingMethodService.byLocationOneCurrency('US', null, 'USD', 'US').then(function (data) {
                        $scope.shippingMethods = data;

                        $rootScope.loading = false;

                        if ($rootScope.cart.shippingInfo != null) {
                            AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                                $scope.authorizeNet = data;

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
            if (!$rootScope.loading) {
                var finalShippingAddress = shippingAddress;

                if ($scope.selectedShippingAddress) {
                    finalShippingAddress = $scope.selectedShippingAddress;
                }

                $rootScope.loading = true;
                CartService.setShippingAddress($rootScope.cart.id, {address: finalShippingAddress}).then(function (result) {

                    $rootScope.cart = result;
                    LoggerServices.success('Shipping address updated');

                    ShippingMethodService.byLocationOneCurrency('US', null, 'USD', 'US').then(function (data) {
                        $scope.shippingMethods = data;

                        $scope.phaseA = false;
                        $scope.phaseB = true;
                        $scope.phaseC = false;

                        $rootScope.loading = false;

                        for (var i = 0; i < $scope.shippingMethods.length; i++) {
                            if ($scope.shippingMethods[i].name == $rootScope.cart.shippingInfo.shippingMethodName) {
                                $scope.shippingMethods[i].selected = true;
                                $scope.selectedShippingMethod = $scope.shippingMethods[i];
                            }
                        }

                    });

                });
            }

        }

        $scope.setShippingMethod = function () {
            if (!$rootScope.loading && $scope.selectedShippingMethod) {
                $rootScope.loading = true;
                CartService.setShippingMethod($rootScope.cart.id, {
                    shippingMethod: {
                        id: $scope.selectedShippingMethod.id,
                        typeId: "shipping-method"
                    }
                }).then(function (result) {
                    $rootScope.cart = result;

                    LoggerServices.success('Shipping method updated');

                    AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                        $scope.authorizeNet = data;

                        $scope.phaseA = false;
                        $scope.phaseB = false;
                        $scope.phaseC = true;

                        $rootScope.loading = false;
                    });
                });

            }
        }

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
            $rootScope.loading = true;

            address.$save(function (response) {
                Authentication.user = response;
                LoggerServices.success('Address added');
                $rootScope.loading = false;
                console.log("success address");
            }, function (response) {
                $scope.error = response.data.message;
                $rootScope.loading = false;
                LoggerServices.error(response);
            });

        };

        $scope.validateShippingAddress = function () {
            return $rootScope.cart &&
                $rootScope.cart.shippingAddress &&
                $rootScope.cart.shippingAddress.streetName &&
                $rootScope.cart.shippingAddress.streetNumber &&
                $rootScope.cart.shippingAddress.firstName &&
                $rootScope.cart.shippingAddress.lastName;
        };

    }
])
;
