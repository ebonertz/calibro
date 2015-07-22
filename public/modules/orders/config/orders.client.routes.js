'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
    function ($stateProvider) {
        // Products state routing
        $stateProvider.
            state('orders', {
                url: '/orders',
                templateUrl: 'modules/orders/views/orders.client.view.html'
            }).
            state('view-order', {
                url: '/orders/:orderId',
                templateUrl: 'modules/orders/views/view-order.client.view.html'
            }).
            state('order-view', {
                url: '/order-view',
                templateUrl: 'modules/orders/views/view-order.client.view.html'
            })

        ;
    }
]);
