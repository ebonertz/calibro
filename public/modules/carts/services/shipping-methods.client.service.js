'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('ShippingMethods', ['$resource',
	function($resource) {
		return $resource('shipping-methods/:shippingMethodId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
