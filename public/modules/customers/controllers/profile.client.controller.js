'use strict';

angular.module('customers').controller('ProfileController', ['$scope', '$http', '$stateParams', '$location', 'Customers', 'Authentication', 'Addresses', 'updateStatus', 'LoggerServices','AddressSelector',
	function($scope, $http, $stateParams, $location, Customers, Authentication, Addresses, updateStatus, LoggerServices,AddressSelector) {
    $scope.dataStates = AddressSelector.dataStates;
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
					Authentication.setUser(response);
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
				LoggerServices.error("The new passwords don't match")
				return
			}

			$http.put('/api/customers/password/update', $scope.password).success(function(response) {
				LoggerServices.success(response.message);
				$scope.password = {}
			}).error(function(response) {
				LoggerServices.error(response.message);
			});
		};

		/*
		 * Addresses
		 */

		$scope.addCustomerAddress = function(form){
			if(form.$valid){
				$scope.success = $scope.error = null;
				var address = new Addresses($scope.newAddress);

				address.$save(function(response) {
					$scope.success = true;
					Authentication.setUser(response);
					$scope.customer = angular.copy(Authentication.user);
					$scope.newAddress = {};

					$scope.addAddressError = null;
					$scope.addAddressSuccess = "Address added successfully"
					updateStatus = {}

					form.$setPristine();
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
					Authentication.setUser(response);
					$scope.customer = angular.copy(Authentication.user);

					$scope.addAddressError = null;
					$scope.addAddressSuccess = "Address deleted successfully"
					updateStatus = {}
				}, function(error) {
					$scope.addAddressError = error.data.message;
				});
			}else{
				console.log("No address to delete.")
				return false;
			}
		}

		$scope.editAddress = function(address){
			if(address){
				$location.path('/edit-address/'+address.id);
			}
		}

		$scope.updateCustomerAddress = function(form){
			if(form.$valid){
				var address = new Addresses($scope.editAddress)

				address.$update(function(response){
					Authentication.setUser(response);
					$location.path('/my-addresses');
					updateStatus.message = "Address updated successfully";
				}, function(error){
					$scope.updateError = "Error updating the address"
				});
			}
		}

		$scope.fetchOwnAddressPerId = function(){
			var id = $stateParams.id

			var addresses = $scope.customer.addresses
			for(var i = 0; i < addresses.length; i++){
				if(addresses[i].id == id){
					return addresses[i]
				}
			}

			// If no address is found´
			$scope.error = "Address not found"
		}

		$scope.defaultAddress = function(){
			$scope.newAddress = {}
			$scope.newAddress.country = ''
		}

		$scope.getUpdateStatus = function(){
			return updateStatus;
		}

		/*
		 * Newsletter subscription
		 */

		$scope.fetchSubscription = function(list){
			$http.get('/api/issubscribed/'+list).success(function(result){
				$scope[list+"Subscription"] = (result.toLowerCase() === 'true')
			})
		};

		$scope.updateSubscription = function(list){
			// TODO prevent abuse
			var urlString = ($scope[list+"Subscription"] ? '/api/unsubscribe/'+list : '/api/subscribe/'+list);
			var params;
			$http.post(urlString, params).success(function(result){
				var status = (result.toLowerCase() === 'true');
				$scope.error = ""
				if(status)
					$scope.success = "An email has been sent to you to complete the subscription"
				else
					$scope.success = "Unsubscribed successfully"

				$scope[list+"Subscription"] = status;
			}).error(function(e){
				$scope.success = null
				$scope.error = e.error
				$scope[list+"Subscription"] = false;
			})
		};

		/*
		 * Order History
		 */

		$scope.fetchOrders = function(){
			$scope.orders = []
			$http.get('/api/orders/own').success(function(result){
				console.log(result)
				$scope.orders = result;
			})
			.error(function(error){
				console.log(error)
			})
		}
	}
]);
