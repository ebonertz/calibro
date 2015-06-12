'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('customers').factory('Addresses', ['$resource',
  function($resource) {
    return $resource('addresses/:id', {id: "@id"}, {
      save: {
        method: 'POST',
        params: {id: ''}
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      }
    });
  }
]);
