'use strict';

//Events service used to communicate Events REST endpoints
angular.module('products').service('ProductService', ['$http', '$q', '$location',
  function ($http, $q, $location) {
    var urlString = '/api/products';

    this.list = function () {
      var deferred = $q.defer();

      $http.get(urlString).success(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }


    this.listBy = function (categoryA, categoryB, attributes, page, perPage, sortAttr, sortAsc) {
      var queryString = urlString + '/categories';

      if (categoryA != null)
        queryString += '/' + categoryA;

      if (categoryB != null)
        queryString += '/' + categoryB;

      queryString += '?page=' + (page == null ? 1 : page);
      queryString += '&perPage=' + (perPage == null ? 10 : perPage);

      if (sortAttr)
        queryString += '&sortAttr=' + sortAttr + '&sortAsc=' + sortAsc;

      return $http.post(queryString, attributes);

    }

    this.search = function (text, attributes, page, perPage, sortAttr, sortAsc) {
      var queryString = urlString + '/search/' + text;

      queryString += '?page=' + (page == null ? 1 : page);
      queryString += '&perPage=' + (perPage == null ? 10 : perPage);

      if (sortAttr)
        queryString += '&sortAttr=' + sortAttr + '&sortAsc=' + sortAsc;

      return $http.post(queryString, attributes);
    }




  }
]);
