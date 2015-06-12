'use strict';

angular.module('customers').controller('ProfileController', ['$scope', '$http', '$location', 'Customers', 'Authentication', 'Addresses', 'ProductUtils',
	function($scope, $http, $location, Customers, Authentication, Addresses, ProductUtils) {
		$scope.customer = angular.copy(Authentication.user);

		// If user is not signed in then redirect back home
		if (!$scope.customer) $location.path('/');

		// Update a user profile
		$scope.updateCustomerProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var customer = new Customers($scope.customer);

				customer.$update(function(response) {
					$scope.success = "Profile updated successfully.";
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

		/*
		 * Addresses
		 */

		$scope.addCustomerAddress = function(isValid){
			if(isValid){
				$scope.success = $scope.error = null;
				var address = new Addresses($scope.newAddress);

				address.$save(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);
					$scope.newAddress = {};

					$scope.addAddressError = null;
					$scope.addAddressSuccess = "Address added successfully"
				}, function(error) {
					$scope.addAddressError = error.data.message;
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
				}, function(error) {
					$scope.addAddressError = error.data.message;
				});
			}else{
				console.log("No address to delete.")
				return false;
			}
		}

		$scope.defaultAddress = function(){
			$scope.newAddress = {}
			$scope.newAddress.country = ''
		}

		/*
		 * Newsletter subscription
		 */

		$scope.fetchSubscription = function(){
			$http.get('/issubscribed').success(function(result){
				$scope.newsletterSubscription = (result.toLowerCase() === 'true')
			})
		}

		$scope.updateSubscription = function(){
			// TODO prevent abuse
			var urlString = ($scope.newsletterSubscription ? '/unsubscribe' : '/subscribe');
			var params;
			$http.post(urlString, params).success(function(result){
				var status = (result.toLowerCase() === 'true');
				$scope.error = ""
				if(status)
					$scope.success = "An email has been sent to you to complete the subscription"
				else
					$scope.success = "Unsubscribed successfully"

				$scope.newsletterSubscription = status;
			}).error(function(e){
				$scope.success = null
				$scope.error = e.error
				$scope.newsletterSubscription = false;
			})
		}

		/*
		 * Order History
		 */

		$scope.fetchOrders = function(){
			$scope.orders = []
			$scope.$utils = ProductUtils;
			
			$http.get('/orders/own').success(function(result){
				console.log(result)
				$scope.orders = result;
			})
			.error(function(error){
				console.log(error)
			})
		}
	}
]);