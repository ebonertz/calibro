'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('api/customers', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('CustomerService', ['$http', 'ipCookie', '$rootScope', 'Authentication',
	function($http, ipCookie, $rootScope, Authentication){
        var funs = {
			setCookie: function(value, rid){
				ipCookie('rem', value, {expires: 21})
                ipCookie('rid', rid, {expires: 21})
			},
			checkCookieAndLogin: function(){
                var funs = this;

				if(!Authentication.user && ipCookie('rem')){
					console.log('Requesting login from cookie')

					var payload = {
						rem: ipCookie('rem'),
						rid: ipCookie('rid')
					}

                    // Add login loader?
					$http.post('/api/auth/token', payload).success(function(response) {
						// If successful we assign the response to the global user model
						Authentication.user = response.customer;
						$rootScope.cart = response.cart;
					}).error(function(error) {
						console.log('Could not login from cookie')
                        funs.removeCookie()
					});
				}
			},
			/*removeCookie: function(){
				console.log("Remove cookie");
				ipCookie.remove('rem');
                ipCookie.remove('rid');
			}*/
		}
        return funs;
	}
])
