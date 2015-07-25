'use strict';

//Setting up route
angular.module('carts').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.
            state('cart', {
                url: '/cart',
                templateUrl: 'modules/carts/views/cart.client.view.html'
            }).
            state('viewCart', {
                url: '/carts/:id',
                templateUrl: 'modules/carts/views/view-cart.client.view.html'
            }).
            state('checkout', {
                url: '/checkout',
                templateUrl: 'modules/carts/views/checkout.client.view.html'
            }).
            state('test', {
                url: '/test',
                templateUrl: 'modules/carts/views/test.html'
            });
    }
]);
