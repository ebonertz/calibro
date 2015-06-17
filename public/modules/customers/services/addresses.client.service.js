'use strict';

// Users service used for communicating with the users REST endpoint
var module = angular.module('customers')

module.factory('Addresses', ['$resource',
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
      },
      get: {
        method: 'GET'
      }
    });
  }
])

// Persistance on update address status when changing route
.factory('updateStatus', function(){
  var status;

  status = status || {}
  return status
})