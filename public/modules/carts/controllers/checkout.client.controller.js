'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService', 'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'ProductUtils', 'Cart',
    function ($scope, Authentication, $rootScope, CartService, ShippingMethods, Order, $location, Addresses, LoggerServices, ProductUtils, Cart) {
        $scope.authentication = Authentication;
        $scope.$utils = ProductUtils;

        ShippingMethods.query(function (data) {
            $scope.shippingMethods = data;
        });

        $scope.selectShippingAddress = function (shippingAddress) {
            $scope.selectedShippingAddress = shippingAddress;
        }

        $scope.selectBillingAddress = function (billingAddress) {
            $scope.selectedBillingAddress = billingAddress;
        }

        $scope.selectShippingMethod = function (shippingMethod) {
            $scope.selectedShippingMethod = shippingMethod;
        }

        $scope.setShippingAddress = function (shippingAddress) {
            var finalShippingAddress = shippingAddress;

            if($scope.selectedShippingAddress) {
                finalShippingAddress = $scope.selectedShippingAddress;
            }

            CartService.setShippingAddress($rootScope.cart.id, {address: finalShippingAddress}).then(function (result) {
                $rootScope.cart = result;
                $scope.shippingMethodClass = 'active';
            });
        }

        $scope.setBillingAddress = function (billingAddress) {
            CartService.setBillingAddress($rootScope.cart.id, {address: billingAddress}).then(function (result) {
                $rootScope.cart = result;
                $scope.reviewOrderClass = 'active';
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
                    $scope.billingAddressClass = 'active';
                });
                ;
            }
        }

        $scope.createOrder = function () {
            var order = new Order({
                id: $rootScope.cart.id,
                version: $rootScope.cart.version
            });

            order.$save(function (response) {
                console.log('Order created.');

                var cart = new Cart({
                    "currency": "EUR",
                    "customerId": Authentication.user.id
                });

                cart.$save(function (sphereCart) {
                    $rootScope.cart = sphereCart;
                    LoggerServices.success('New Cart created for user in Sphere. ID: ' + $rootScope.cart.id);
                });

                $location.path('orders/' + response.id);

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


        $(document).ready(function() {
            $('#paymentNetworks').checkoutList(
                {
                    payButton: "submitBtn",
                    listUrl: "https://api.sandbox.oscato.com/pci/v1/557a027ee4b088681feeb4b3l",
                    smartSwitch: true
                }
            );
        });


    }
]);
