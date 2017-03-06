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

.factory('CustomerService', ['$http', 'ipCookie', '$rootScope', 'Authentication', '$q',
  function($http, ipCookie, $rootScope, Authentication, $q) {
    var funs = {
      setCookie: function(value, rid) {
        ipCookie('rem', value, {
          expires: 21
        })
        ipCookie('rid', rid, {
          expires: 21
        })
      },
      checkCookieAndLogin: function() {
        var funs = this;

        if (!Authentication.user && ipCookie('rem')) {
          console.debug('Requesting login from cookie')

          var payload = {
            rem: ipCookie('rem'),
            rid: ipCookie('rid')
          }

          // Add login loader?
          return $http.post('/api/auth/token', payload).then(function(response) {
            // If successful we assign the response to the global user model
            Authentication.setUser(response.data.customer);
            return response.data.cart;
          }).catch(function(err) {
            console.log('Could not login from cookie')
            funs.removeCookie()
            return $q.reject(err);
          });
        } else {
          return $q.reject();
        }
      },
      removeCookie: function() {
        console.debug("Remove cookie");
        ipCookie.remove('rem');
        ipCookie.remove('rid');
      }
    }
    return funs;
  }
])
