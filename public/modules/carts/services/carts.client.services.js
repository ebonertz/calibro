'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', '$cookies', '$rootScope', 'Authentication', 'LoggerServices', 'Cart',
    function ($http, $q, $cookies, $rootScope, Authentication, LoggerServices, Cart) {
        var urlString = '/api/carts';

        this.pageLoad = function () {

            $rootScope.loading = true;

            var customerId = null,
                cookieId = null;

            if (Authentication.user != null) {
                customerId = Authentication.user.id;
            }

            if ($cookies.anonymousCart != null) {
                cookieId = $cookies.anonymousCart;
            }

            this.init(customerId, cookieId).then(function (cart) {
                console.log('Cart ID: ' + cart.id);
                $rootScope.cart = cart;

                if(customerId == null) {
                    $cookies.anonymousCart = cart.id;
                    console.log('Cart saved in cookie.');
                }

                $rootScope.loading = false;
            });

        }

        this.addToCart = function (productId, variantId, channel, quantity) {

            var payload = {
                productId: productId,
                variantId: variantId,
                quantity: quantity,
                distributionChannel: channel
            }

            $rootScope.loading = true;

            this.addLineItem($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
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

        this.addHighIndex = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/highIndex/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.removeHighIndex = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeHighIndex/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.init = function (customerId, cookieId) {
            var deferred = $q.defer();

            var path = urlString + '/init?';

            if(customerId) {
                path += 'customer=' + customerId;
            }

            if(cookieId) {
                path += '&cookie=' + cookieId;
            }

            $http.get(path).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }
]);
