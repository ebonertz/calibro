'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider) {
		// Redirect to home view when route not found
		if(window.location.search && window.location.search.match(/\?_escaped_fragment_/i)){
			// Bot crawling website
		}else
			$urlRouterProvider.otherwise('/');

		$locationProvider.html5Mode(true);

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('landingSummer', {
			url: '/landing/summer/:gender',
			templateUrl: 'modules/core/views/landing-summer.client.view.html'
		});
	}
]);
