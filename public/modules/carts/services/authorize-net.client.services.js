'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('AuthorizeNetService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/authorize-net';

        this.get = function (amount) {
            var deferred = $q.defer();

            $http.get(urlString + '/get?amount=' + amount).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
