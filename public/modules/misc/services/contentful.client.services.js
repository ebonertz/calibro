'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('ContentfulService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/contentful';

        this.home = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/home').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
