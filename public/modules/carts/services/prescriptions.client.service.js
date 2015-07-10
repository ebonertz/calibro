'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('Prescriptions', ['$resource',
    function($resource) {
        return $resource('prescriptions/:cartId', { cartId: '@_id'
        }, {
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            },
            get: {
                method: 'GET'
            }
        });
    }
]);
