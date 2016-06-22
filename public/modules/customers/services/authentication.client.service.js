'use strict';

// Authentication service for user variables
angular.module('customers').factory('Authentication', ['$window',
	function ($window) {
		var auth = {
			user: $window.user !== "" ? window.user : null
		};

		return auth;
	}
]);
