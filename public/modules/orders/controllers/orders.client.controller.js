'use strict';

angular.module('orders').controller('OrdersController', ['$scope', 'Authentication', 'Order', '$stateParams',
    function ($scope, Authentication, Order, $stateParams) {
        $scope.authentication = Authentication;

        $scope.findOne = function () {
            Order.get({
                orderId: $stateParams.orderId
            }, function (data) {
                $scope.order = data;
            });
        }

    }
]);
