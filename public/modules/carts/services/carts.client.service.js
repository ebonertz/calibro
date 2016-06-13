'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('Cart', ['$resource',
	function($resource) {
		return $resource('api/carts/:cartId', {
			cartId: '@_cartId'
		}
		, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
