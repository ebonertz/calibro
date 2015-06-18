'use strict';

angular.module('customers').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.requestPasswordReset = function(){
			$scope.reset_result = null;

			$http.post('/customers/password-token', $scope.reset).success(function(response){
				$scope.reset_result = {
					status: "success",
					message: "An email has been sent to reset the password"
				}
			}).error(function(error){
				$scope.reset_result = {
					status: "error",
					message: error.message
				}				
			})
		}

		$scope.resetPassword = function(){
			$scope.reset_result = null;

			var payload = {
				token: $stateParams.token,
				password: $scope.reset.password
			}

			if($scope.reset.password != $scope.reset.repeatPassword){
				$scope.reset = {};
				$scope.reset_result = {
					status: "error",
					message: "Password do not match"
				}
				return false;
			}

			$http.post('/customers/password/reset', payload).success(function(response){
				$scope.reset = {};
				Authentication.user = response;

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
	}
]);