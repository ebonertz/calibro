'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('customers', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);