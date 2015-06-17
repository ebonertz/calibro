'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('CustomObjectService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/custom-objects';

        this.find = function (container, key) {
            var deferred = $q.defer();

            $http.get(urlString + '/find?container=' + container + '&key=' + key).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
