'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('PaypalService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/Paypal';

        this.setExpressCheckout = function (currencyCode, amount, cartId) {
            var deferred = $q.defer();

            $http.get(urlString + '/setExpressCheckout?currency=' + currencyCode + '&amount=' + amount + '&cart=' + cartId).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
