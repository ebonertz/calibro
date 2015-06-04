'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
