'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', '$cookies', '$rootScope', 'Authentication', 'LoggerServices', 'Cart',
    function ($http, $q, $cookies, $rootScope, Authentication, LoggerServices, Cart) {
        var urlString = '/carts';

        var anonymousCart = {
            "currency": "EUR"
        };

        this.pageLoad = function () {

            if (Authentication.user) {


            } else {

                if ($cookies.anonymousCart == null || $cookies.anonymousCart == 'null') {
                    var cart = new Cart(anonymousCart);

                    // Create Cart in SPHERE.
                    cart.$save(function (sphereCart) {

                        $rootScope.cart = sphereCart;
                        $cookies.anonymousCart = sphereCart.id;

                        LoggerServices.success('Anonymous cart created in Sphere. ID: ' + $rootScope.cart.id);

                    }, function (errorResponse) {
                        LoggerServices.error('Error while saving to Sphere');
                    });
                } else {

                    Cart.get({
                        cartId: $cookies.anonymousCart
                    }, function (data) {
                        $rootScope.cart = data;
                        $rootScope.cart = data;
                        LoggerServices.success('Anonymous cart found in cookie. ID: ' + $rootScope.cart.id);
                    });
                }


            }

        }

        this.addToCart = function (item) {

            var payload = {
                productId: item.id,
                variantId: item.masterData.current.masterVariant.id,
                quantity: 1
            }

            this.addLineItem($rootScope.cart.id, payload).then(function (result) {
                LoggerServices.success('Added to Sphere Cart ' + result);
                $rootScope.cart = result;
            }, function (error) {
                LoggerServices.success('Error while adding to Sphere Cart');
            });

        }

        this.addLineItem = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addLineItem/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
