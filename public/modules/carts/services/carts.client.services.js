'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', '$cookies', '$rootScope', 'Authentication', 'LoggerServices', 'Cart',
    function ($http, $q, $cookies, $rootScope, Authentication, LoggerServices, Cart) {
        var urlString = '/carts';

        this.pageLoad = function () {

            $rootScope.loading = true;

            if (Authentication.user) {

                this.byCustomer(Authentication.user.id).then(function (cart) {

                    if (cart != null) {
                        $rootScope.cart = cart;
                        console.log('User already has a cart in Sphere. ID: ' + $rootScope.cart.id);
                        $rootScope.loading = false;
                    } else {
                        this.service.createCart(Authentication.user.id);
                    }

                }.bind({service: this}), function (error) {
                    this.service.createCart(Authentication.user.id);
                }.bind({service: this}));

            } else {

                if ($cookies.anonymousCart == null || $cookies.anonymousCart == 'null') {
                    this.createCart(null);
                } else {

                    //Cart.get({
                    //        cartId: $cookies.anonymousCart
                    //    }, function (data) {
                    //
                    //        // This check is to avoid showing a user cart, that started as an anonymous cart.
                    //        if (data.customerId != null) {
                    //            this.service.createCart(null);
                    //        } else {
                    //            $rootScope.cart = data;
                    //            console.log('Anonymous cart found in cookie. ID: ' + $rootScope.cart.id);
                    //            $rootScope.loading = false;
                    //        }
                    //
                    //    }.bind({service: this}),
                    //    function (error) {
                    //        this.service.createCart(null);
                    //    }.bind({service: this}));
                }
            }

        }

        this.createCart = function (customerId) {
            $rootScope.loading = true;
            var cart = new Cart({
                "currency": "USD",
                "customerId": customerId
            });

            cart.$save(function (sphereCart) {
                $rootScope.cart = sphereCart;
                if (customerId == null)
                    $cookies.anonymousCart = sphereCart.id;
                console.log('New Cart created in Sphere. ID: ' + $rootScope.cart.id + ' ' + (customerId ? ' User ' + customerId : ' Anonymous'));
                $rootScope.loading = false;
            });
        }

        this.addToCart = function (productId, variantId, quantity) {

            var payload = {
                productId: productId,
                variantId: variantId,
                quantity: quantity
            }

            $rootScope.loading = true;

            this.addLineItem($rootScope.cart.id,  $rootScope.cart.version, payload).then(function (result) {
                LoggerServices.success('Product added');
                $rootScope.cart = result;
                $rootScope.loading = false;
            }, function (error) {
                LoggerServices.error('Error while adding to Sphere Cart');
                $rootScope.loading = false;
            });

        }

        this.removeFromCart = function (item) {

            var payload = {
                lineItemId: item.id
            }

            $rootScope.loading = true;

            this.removeLineItem($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
                LoggerServices.success('Product removed');
                $rootScope.cart = result;
                $rootScope.loading = false;
            }, function (error) {
                LoggerServices.success('Error while removing to Sphere Cart. Restoring previous one.');
                $rootScope.loading = false;
            });

        }

        this.addLineItem = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addLineItem/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.removeLineItem = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeLineItem/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.byCustomer = function (customerId) {
            var deferred = $q.defer();

            $http.get(urlString + '/byCustomer/' + customerId).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setShippingAddress = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingAddress/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setBillingAddress = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setBillingAddress/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setShippingMethod = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingMethod/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.changeLineItemQuantity = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/changeLineItemQuantity/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.addDiscountCode = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addDiscountCode/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }
]);
