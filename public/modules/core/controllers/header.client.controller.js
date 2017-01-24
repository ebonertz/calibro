'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService', '$location','$rootScope','$http','$window','ipCookie', 'ContentfulService',
	function($scope, Authentication, Menus, CartService, CustomerService, $location,$rootScope,$http,$window,ipCookie, ContentfulService) {
		$scope.authentication = Authentication;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.proceedToCheckout = function () {
			if ($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0) {
				var cookieId = null;
				if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
					cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
				}
				if (!Authentication.user && cookieId) {
					CartService.refreshCart(cookieId).then(function (cart) {
						$rootScope.cart = cart;
						$location.path('/checkout');
					});
				}
				else {
					$location.path('/checkout');
				}
			}
		}

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

		ContentfulService.getView('header').then(function(view) {
			$scope.view = view;
		})

	}
]);
