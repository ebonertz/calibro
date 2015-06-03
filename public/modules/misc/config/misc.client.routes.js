'use strict';

//Setting up route
angular.module('misc').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.
            state('locations', {
                url: '/locations',
                templateUrl: 'modules/misc/views/locations.client.view.html'
            }).
            state('about-us', {
                url: '/about-us',
                templateUrl: 'modules/misc/views/about-us.client.view.html'
            }).
            state('help', {
                url: '/help',
                templateUrl: 'modules/misc/views/help.client.view.html'
            });
    }
]);
