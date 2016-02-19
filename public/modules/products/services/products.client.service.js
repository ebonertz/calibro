'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('api/products/:id', { id: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      get: {
        method: 'GET'
      }
		});
	}
]);
