'use strict';

angular.module('customers').controller('ProfileController', ['$scope', '$http', '$location', 'Customers', 'Authentication', 'Addresses',
	function($scope, $http, $location, Customers, Authentication, Addresses) {
		$scope.customer = angular.copy(Authentication.user);

		// If user is not signed in then redirect back home
		if (!$scope.customer) $location.path('/');

		// Update a user profile
		$scope.updateCustomerProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var customer = new Customers($scope.customer);

				customer.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeCustomerPassword = function() {
			$scope.success = $scope.error = null;

			if($scope.password.newPassword != $scope.password.repeatPassword){
				$scope.error = "The new passwords don't match"
				return
			}

			$http.post('/customers/password', $scope.password).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.addCustomerAddress = function(isValid){
			if(isValid){
				$scope.success = $scope.error = null;
				var address = new Addresses($scope.newAddress);

				address.$create(function(response) {
					$scope.success = true;
					Authentication.user = response.body;
					$scope.customer = angular.copy(Authentication.user);
				}, function(response) {
					$scope.error = response.data.message;
				});
			}else{
				$scope.submitted = true;
			}
		};

		$scope.deleteAddress = function(address){
			if(address){
				$scope.success = $scope.error = null;
				var address = new Addresses(address);

				address.$delete(function(response){
					$scope.success = true;
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);
				}, function(response) {
					$scope.error = response.data.message;
				});
			}else{
				console.log("No address to delete.")
				return false;
			}
		}
	}
]);