'use strict';

angular.module('customers').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');


		$scope.resetPassword = function(){
			$scope.reset_result = null;

			var payload = {
				token: $stateParams.token,
				password: $scope.reset.password
			}

			// Make sure the passwords match
			if($scope.reset.password != $scope.reset.repeatPassword){
				$scope.reset = {};
				$scope.reset_result = {
					status: "error",
					message: "Password do not match"
				}
				return false;
			}

			// Request password to be updated
			$http.post('/customers/password/reset', payload).success(function(response){
				$scope.reset = {};
				// Authentication.user = response;

				$scope.reset_result = {
					status: "success",
					message: "Password reset successful"
				}
			}).error(function(response) {
				$scope.reset_result = {
					status: "error",
					message: response.message
				}
			});
		}

		
		$scope.cancel = function(){
			$location.path('/')
		}
		$scope.goToLogin = function(){
			$location.path('/login')
		}
	}
]);