'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService', 'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'ProductUtils', 'Cart', 'AuthorizeNetService',
    function ($scope, Authentication, $rootScope, CartService, ShippingMethods, Order, $location, Addresses, LoggerServices, ProductUtils, Cart, AuthorizeNetService) {

        setTimeout(function () {
            if ($rootScope.cart!= null && $rootScope.cart.shippingInfo != null) {
                AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                    $scope.authorizeNet = data;

                    for(var i = 0; i < $scope.shippingMethods.length; i++) {
                        if($scope.shippingMethods[i].name == $rootScope.cart.shippingInfo.shippingMethodName) {
                            $scope.shippingMethods[i].selected = true;
                        }
                    }

                });
            }
        }, 3000);

        $scope.authentication = Authentication;
        $scope.$utils = ProductUtils;

        ShippingMethods.query(function (data) {
            $scope.shippingMethods = data;
        });

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
         */

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
]);
