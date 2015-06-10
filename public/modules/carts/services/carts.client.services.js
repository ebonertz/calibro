'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', '$cookies', '$rootScope', 'Authentication', 'LoggerServices', 'Cart',
    function ($http, $q, $cookies, $rootScope, Authentication, LoggerServices, Cart) {
        var urlString = '/carts';

        this.pageLoad = function () {

            if (Authentication.user) {

                this.byCustomer(Authentication.user.id).then(function (carts) {

                    if (carts != null && carts.length > 0) {
                        $rootScope.cart = carts[0];
                        LoggerServices.success('User already has a cart in Sphere. ID: ' + $rootScope.cart.id);

                    } else {

                        var cart = new Cart({
                            "currency": "EUR",
                            "customerId": Authentication.user.id
                        });

                        cart.$save(function (sphereCart) {
                            $rootScope.cart = sphereCart;
                            LoggerServices.success('New Cart created for user in Sphere. ID: ' + $rootScope.cart.id);
                        });


                    }

                });

            } else {

                if ($cookies.anonymousCart == null || $cookies.anonymousCart == 'null') {
                    this.createAnonymous();
                } else {

                    Cart.get({
                            cartId: $cookies.anonymousCart
                        }, function (data) {

                            // This check is to avoid showing a user cart, that started as an anonymous cart.
                            if (data.customerId != null) {
                                this.service.createAnonymous();
                            } else {
                                $rootScope.cart = data;
                                LoggerServices.success('Anonymous cart found in cookie. ID: ' + $rootScope.cart.id);
                            }

                        }.bind({service: this}),
                        function (error) {
                            this.service.createAnonymous();
                        }.bind({service: this}));
                }
            }

        }

        this.createAnonymous = function () {
            var cart = new Cart({
                "currency": "EUR"
            });

            cart.$save(function (sphereCart) {
                $rootScope.cart = sphereCart;
                $cookies.anonymousCart = sphereCart.id;
                LoggerServices.success('Anonymous cart created in Sphere. ID: ' + $rootScope.cart.id);
            });

        }

        this.addToCart = function (productId, variantId, quantity) {

            var payload = {
                productId: productId,
                variantId: variantId,
                quantity: quantity
            }

            this.addLineItem($rootScope.cart.id, payload).then(function (result) {
                LoggerServices.success('Added to Sphere Cart ' + result);
                $rootScope.cart = result;
            }, function (error) {
                LoggerServices.success('Error while adding to Sphere Cart');
            });

        }

        this.removeFromCart = function (item) {

            var payload = {
                lineItemId: item.id
            }

            /*for (var i in $rootScope.cart.lineItems) {
                if ($rootScope.cart.lineItems[i].id === item.id) {
                    $rootScope.cart.lineItems.splice(i, 1);
                }
            }*/

            this.removeLineItem($rootScope.cart.id, payload).then(function (result) {
                LoggerServices.success('Remove from Sphere Cart ' + result);
                $rootScope.cart = result;
            }, function (error) {
                LoggerServices.success('Error while removing to Sphere Cart. Restoring previous one.');
            });

        }

        this.addLineItem = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addLineItem/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.removeLineItem = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeLineItem/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.byCustomer = function (customerId) {
            var deferred = $q.defer();

            $http.get(urlString + '/byCustomer/' + customerId).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.setShippingAddress = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingAddress/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.setBillingAddress = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setBillingAddress/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.setShippingMethod = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingMethod/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.changeLineItemQuantity = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/changeLineItemQuantity/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
