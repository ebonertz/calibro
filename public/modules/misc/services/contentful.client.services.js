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

        this.eyewear = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/category/eyewear').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.sunglasses = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/category/sunglasses').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.menSummer = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/men/summer').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.womenSummer = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/women/summer').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);
