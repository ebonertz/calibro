'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('customers').factory('Addresses', ['$resource',
  function($resource) {
    return $resource('addresses/:id', {id: "@_id"}, {
      save: {
        method: 'POST'
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
