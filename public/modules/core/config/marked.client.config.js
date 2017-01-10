angular.module('core').config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({gfm: true});
}]);
