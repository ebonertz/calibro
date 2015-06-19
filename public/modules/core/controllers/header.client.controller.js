'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService',
	function($scope, Authentication, Menus, CartService, CustomerService) {
		$scope.authentication = Authentication;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.logout = function(){
			CustomerService.removeCookie();
		}

	}
]);
