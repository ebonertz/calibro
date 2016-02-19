'use strict';

angular.module('orders').factory('Order', ['$resource',
	function($resource) {
		return $resource('api/orders/:orderId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
