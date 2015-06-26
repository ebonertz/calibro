'use strict';

angular.module('misc').controller('LocationsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.authentication = Authentication;

  }
]);
