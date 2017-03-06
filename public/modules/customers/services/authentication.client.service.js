'use strict';

// Authentication service for user variables
angular.module('customers').factory('Authentication', ['$window',
	function ($window) {

		// Hack around to get some visibility while keeping Authentication.user
		// and previous default value
		var factory = {
			user: $window.user !== '' ? window.user : null
		};

		factory.setUser = function(user) {
			factory.user = user;
		};

		return factory;
	}
]);
