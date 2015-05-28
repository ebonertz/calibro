'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('Cart', ['$resource',
	function($resource) {
		return $resource('carts/:cartId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
