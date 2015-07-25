'use strict';

angular.module('orders').controller('OrdersController', ['$scope', 'Authentication', 'Order', '$stateParams', 'CustomObjectService', 'ProductUtils',
    function ($scope, Authentication, Order, $stateParams, CustomObjectService, ProductUtils) {
        $scope.authentication = Authentication;
        $scope.$utils = ProductUtils;

        $scope.findOne = function () {
            var id = null;

            if ($stateParams.orderId == null) {
                id = $stateParams.orderId;
            } else {
                id = $stateParams.orderId;
            }

            Order.get({
                orderId: id
            }, function (data) {
                $scope.order = data;
            });

            CustomObjectService.find('checkoutInfo', $stateParams.orderId).then(function (customObject) {
                $scope.paymentInfo = customObject;
            });


        }

    }
]);
