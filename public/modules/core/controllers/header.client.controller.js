'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService', 'ProductUtils', '$location',
	function($scope, Authentication, Menus, CartService, CustomerService, ProductUtils, $location) {
		$scope.authentication = Authentication;
		$scope.$utils = ProductUtils;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.logout = function(){
			window.location = '/api/auth/signout'
		}

		$scope.search = function(text){
			$location.path('text/' + text);
		}

	}
]);
