'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('ContentfulService', ['$http', '$q', '$resource',
  function($http, $q, $resource) {
    var service = {};
    var urlString = '/contentful';
    service.Contentful = $resource(urlString + '/:dir/:type/:name', {}, {
      search: {
        method: 'GET',
        params: {
          dir: 's'
        },
        cache: true
      },
      getView: {
        method: 'GET',
        params: {
          dir: 'v'
        },
        cache: true
      },
      help: {
        method: 'GET',
        url: urlString + '/:dir',
        params: {dir: 'help'},
        cache: true
      }
    });

    service.eyewear = function(gender) {
      var deferred = $q.defer();

      $http.get(urlString + '/category/eyewear/' + gender).success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }

    service.sunglasses = function(gender) {
      var deferred = $q.defer();

      $http.get(urlString + '/category/sunglasses/' + gender).success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }

    service.summer = function(gender) {
      var deferred = $q.defer();

      $http.get(urlString + '/summer/' + gender).success(function(data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }

    service.help = function(){
      var res = service.Contentful.help();

      return res.$promise;
    }

    service.search = function(type, name) {
      var res = service.Contentful.search({
        type: type,
        name: name
      });

      return res.$promise;
    }

    service.getView = function(name) {
      var resource = service.Contentful.getView({
        type: name
      });

      return resource.$promise;
    }

    return service;
  }
]);
