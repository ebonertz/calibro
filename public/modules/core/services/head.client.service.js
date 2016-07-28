'use strict';
angular.module('core').factory('HeadDataService', ['$http',
    function ($http) {
        var headData = null;
        $http.get('/api/config').success(function (data) {
            headData = data;
        });

        return {
            headData: function () {
                return headData;
            }
        };
    }
]);
