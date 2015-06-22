'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService', 'ProductUtils',
	function($scope, Authentication, Menus, CartService, CustomerService, ProductUtils) {
		$scope.authentication = Authentication;
		$scope.$utils = ProductUtils;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.logout = function(){
			CustomerService.removeCookie();
		}

	}
]);
