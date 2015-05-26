'use strict';

//Events service used to communicate Events REST endpoints
angular.module('products').service('CartService', ['$http', '$q', '$cookies', '$rootScope',
    function ($http, $q, $cookies, $rootScope) {
        var urlString = '/carts';

        this.createAnonymous = function () {

            var cart = null;

            if ($cookies.anonymousCart == null || $cookies.anonymousCart == 'null') {
                cart = {
                    "type": "Cart",
                    "version": 1,
                    "lineItems": [],
                    "cartState": "Active",
                    "totalPrice": {
                        "currencyCode": "USD",
                        "centAmount": 0
                    },
                    "inventoryMode": "None",
                    "customLineItems": [],
                    "discountCodes": []
                };

                $cookies.anonymousCart = JSON.stringify(cart);

            } else {
                try {
                    cart = JSON.parse($cookies.anonymousCart)
                }
                catch (err) {
                    $cookies.anonymousCart = null;
                }
            }

            return cart;
        }

        this.addToCart = function (item) {
            if ($rootScope.cart != null && $rootScope.cart.lineItems.indexOf(item) == -1) {
                $rootScope.cart.lineItems.push(item);
                $cookies.anonymousCart = JSON.stringify($rootScope.cart);
            }
        }

    }
]);
