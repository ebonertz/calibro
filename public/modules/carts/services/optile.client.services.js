'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('OptileService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/optile';

        this.list = function (country, customer, payment) {
            var deferred = $q.defer();

            var payload = {
                "country": country,
                "customer": customer,
                "payment": payment
            };

            $http.post(urlString + '/list', payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
