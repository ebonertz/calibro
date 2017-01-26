'use strict';

angular.module('misc').controller('SimplePageController', ['$scope', 'ContentfulService', '$state',
  function($scope, ContentfulService, $state) {

    $scope.loadContent = function() {
      var slug = $state.current.name
      ContentfulService.getView(slug).then(function(view) {
        $scope.view = view;
      }).catch(function(e){
        console.debug('View ' + state + ' couldn\'t be loaded: ' + e.data);
      });
    }
  }
]);
