'use strict';

angular.module('orders').factory('Order', ['$resource',
	function($resource) {
		return $resource('orders/:orderId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
