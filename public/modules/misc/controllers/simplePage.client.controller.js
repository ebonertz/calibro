'use strict';

angular.module('misc').controller('SimplePageController', ['$scope', 'ContentfulService', '$state',
  function($scope, ContentfulService, $state) {
    var state = $state.current.name
    ContentfulService.getView(state).then(function(view) {
      $scope.view = view;
    }).catch(function(e){
      console.debug('View ' + state + ' couldn\'t be loaded: ' + e.data);
    });
  }
]);
