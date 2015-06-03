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
            state('order-final', {
                url: '/order-final',
                templateUrl: 'modules/orders/views/order-final.client.view.html'
            });
        ;
    }
]);
