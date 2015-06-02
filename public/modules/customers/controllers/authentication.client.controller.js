'use strict';

angular.module('customers').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope',
	function($scope, $http, $location, Authentication, $rootScope) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.register = function() {
			if($scope.register.password != $scope.register.repeatPassword){
				$scope.register.error = "Passwords do not match"
				return false
			}

      var createValues = {
        email: $scope.register.email,
        password: $scope.register.password
      }
			$http.post('/auth/signup', createValues).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.register.error = response.message;
			});
		};

		$scope.signin = function() {
			$scope.credentials.anonymousCartId = $rootScope.cart.id;
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response.customer;
				$rootScope.cart = response.cart;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.login.error = response.message;
			});
		};
	}
]);