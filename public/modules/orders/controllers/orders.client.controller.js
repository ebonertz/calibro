'use strict';

angular.module('orders').controller('OrdersController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;

    }
]);
