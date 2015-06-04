'use strict';

angular.module('customers').controller('CustomerController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
