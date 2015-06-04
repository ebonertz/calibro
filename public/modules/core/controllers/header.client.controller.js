'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService',
	function($scope, Authentication, Menus, CartService) {
		$scope.authentication = Authentication;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

	}
]);
