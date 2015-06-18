'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('login', {
                url: '/login',
                templateUrl: 'modules/customers/views/login.client.view.html'
            }).
            state('account', {
                url: '/account',
                templateUrl: 'modules/customers/views/account.client.view.html'
            }).
            state('account-new', {
                url: '/account-new',
                templateUrl: 'modules/customers/views/account-new.client.view.html'
            }).
            state('edit-address', {
                url: '/edit-address/:id',
                templateUrl: 'modules/customers/views/my-account/edit-address.client.view.html'
            }).
            state('edit-card', {
                url: '/edit-card',
                templateUrl: 'modules/customers/views/my-account/edit-card.client.view.html'
            }).
            state('my-addresses', {
                url: '/my-addresses',
                templateUrl: 'modules/customers/views/my-account/my-addresses.client.view.html'
            }).
            state('my-orders', {
                url: '/my-orders',
                templateUrl: 'modules/customers/views/my-account/my-orders.client.view.html'
            }).
            state('my-payment-methods', {
                url: '/my-payment-methods',
                templateUrl: 'modules/customers/views/my-account/my-payment-methods.client.view.html'
            }).
            state('order-details', {
                url: '/order-details',
                templateUrl: 'modules/customers/views/my-account/order-details.client.view.html'
            }).
            state('reset-password', {
                url: '/password/reset/:token',
                templateUrl: 'modules/customers/views/reset-password.client.view.html'
            });
    }
]);
