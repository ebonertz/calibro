'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('ContentfulService', ['$http', '$q', '$resource',
    function ($http, $q, $resource) {
        var urlString = '/contentful';
        var Contentful = $resource(urlString + '/:res/:type/:name', {}, {
          search: {
            method: 'GET',
            params: {
              res: 's'
            },
            cache: true
          }
        });

        this.home = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/home').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.eyewear = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/category/eyewear/' + gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.sunglasses = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/category/sunglasses/' + gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.summer = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/summer/'+gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.help = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/help').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }


        this.byTypeAndName = function (type, name) {
            return $http.get(urlString + '/s/', {
                params: {
                    type: type,
                    name: name
                }
            });
        };

        this.search = function (type, name) {
          var res = Contentful.search({type: type, name: name});

          return res.$promise;
        }
    }
]);
