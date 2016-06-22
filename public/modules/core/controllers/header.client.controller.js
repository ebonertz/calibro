'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService', 'ProductUtils', '$location','$rootScope','$http','$window',
	function($scope, Authentication, Menus, CartService, CustomerService, ProductUtils, $location,$rootScope,$http,$window) {
		$scope.authentication = Authentication;
		$scope.$utils = ProductUtils;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.signout = function () {
			$http.get('/api/auth/signout').success(function (result) {
				$rootScope.cart = result;
				$window.location = '/';


			}).error(function (error) {
				console.log(error)
			});
		}

		$scope.search = function(text){
			$location.path('text/' + text);
		}

	}
]);
