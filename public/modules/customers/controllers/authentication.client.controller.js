'use strict';

angular.module('customers').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope', 'CustomerService', 'LoggerServices',
	function($scope, $http, $location, Authentication, $rootScope, CustomerService, LoggerServices) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.register = function() {
			var createValues = {
                firstName: $scope.register.firstName,
                lastName: $scope.register.lastName,
                email: $scope.register.email,
                password: $scope.register.password
			}

			$http.post('/auth/signup', createValues).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				$scope.register = {}

				// And redirect to the index page
				$location.path('#!/account');
			}).error(function(response) {
				$scope.register_error = response.message;
			});
		};

		$scope.signin = function() {
			$rootScope.loading = true;
			$scope.credentials.anonymousCartId = $rootScope.cart.id;

			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response.customer;
				$rootScope.cart = response.cart;
				console.log('Cart from Sphere after login. ID: ' + $rootScope.cart.id);
				if(response.hasOwnProperty('remember')){
					CustomerService.setCookie(response.remember.rem, response.remember.rid)
				}

				$scope.credentials = {}

				// And redirect to the index page
				$location.path('/');
				$rootScope.loading = false;
			}).error(function(response) {
				LoggerServices.error('Login failed')
				$rootScope.loading = false;
			});
		};

		$scope.requestPasswordReset = function(){
			$scope.reset_result = null;

			$http.post('/customers/password-token', $scope.reset).success(function(response){
				$scope.reset_result = {
					status: "success",
					message: "An email has been sent to reset the password"
				}
				$scope.reset = {}
			}).error(function(error){
				$scope.reset_result = {
					status: "error",
					message: "We couldn't find that email in our database"
				}				
			})
		}
	}
]);
