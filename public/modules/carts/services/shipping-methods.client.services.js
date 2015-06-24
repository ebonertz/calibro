'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('ShippingMethodService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/shipping-methods';

        this.byLocationOneCurrency = function (country, state, currency, zonename) {
            var deferred = $q.defer();

            var path = '',
                params = [];

            if (country)
                params.push('country=' + country);
            if (state)
                params.push('state=' + state);
            if (currency)
                params.push('currency=' + currency);
            if (zonename)
                params.push('zonename=' + zonename);

            for (var i = 0; i < params.length; i++) {
                if (i == 0)
                    path = '?' + params[i]
                else {
                    path += '&' + params[i]
                }
            }

            $http.get(urlString + '/byLocationOneCurrency' + path).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
