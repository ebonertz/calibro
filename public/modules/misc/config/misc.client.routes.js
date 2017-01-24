'use strict';

//Setting up route
angular.module('misc').config(['$stateProvider',
  function($stateProvider) {

    $stateProvider.
    state('locations', {
      url: '/locations',
      templateUrl: 'modules/misc/views/locations.client.view.html'
    }).
    state('about-us', {
      url: '/about-us',
      templateUrl: 'modules/misc/views/simple-page.client.view.html',
    }).
    state('support', {
      url: '/support',
      templateUrl: 'modules/misc/views/help.client.view.html'
    }).
    state('privacy', {
      url: '/privacy',
      templateUrl: 'modules/misc/views/simple-page.client.view.html'
    }).
    state('terms-of-use', {
      url: '/terms-of-use',
      templateUrl: 'modules/misc/views/simple-page.client.view.html'
    });
  }
]);
