'use strict';

angular.module('orders').controller('OrdersController', ['$scope', 'Authentication', 'Order', '$stateParams',
    function ($scope, Authentication, Order, $stateParams) {
        $scope.authentication = Authentication;

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
                $scope.paymentInfo = data.paymentInfo!=null && data.paymentInfo.payments!=null && data.paymentInfo.payments.length>0 ? data.paymentInfo.payments[0].obj.paymentMethodInfo.method:'Credit Card';
                $scope.order = data;
            });


        }

    }
]);
