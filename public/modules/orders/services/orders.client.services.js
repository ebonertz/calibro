'use strict';

//Events service used to communicate Events REST endpoints
angular.module('orders').service('OrderService', ['$http', '$q', '$location', '$window',
    function ($http, $q, $location, $window) {
        var urlString = '/orders';

        this.fromPaypal = function (cartId, version) {
            $window.location.href = urlString + '/fromPaypal/' + cartId + '?version=' + version;
            //$http.get(urlString + '/fromPaypal/' + cartId + '?version=' + version);
        }


    }
]);
