'use strict';

//Events service used to communicate Events REST endpoints
angular.module('braintree').service('BraintreeService', ['$http', '$q',
    function ($http, $q) {

        this.clientToken = function (userId) {
            var deferred = $q.defer();
            var queryString = "";
            if (userId) {
              queryString += "?customerId=" + userId
            }
            $http.get('/braintree/clientToken'+queryString).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.checkout = function (checkoutParameters) {
            var deferred = $q.defer();

            $http.post('/braintree/checkout',checkoutParameters).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }


    }
]);
