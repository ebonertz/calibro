angular.module('carts').directive('prescriptionBox', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionBox.client.template.html',
        scope: {
          'header': '@',
          'content': '=',
        },
        replace: true,
        link: function ($scope, $element, $attrs) {
          // We don't want watches here!
          $element.parent().children().css('width', Math.floor(100/($element.parent().children().length)) + "%");
        }
    }
});

angular.module('carts').directive('prescriptionInput', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionInput.client.template.html',
        scope: {
          'header': '@',
          'content': '=',
        },
        replace: true,
        link: function ($scope, $element, $attrs) {
          // We don't want watches here!
          $element.parent().children().css('width', Math.floor(100/($element.parent().children().length)) + "%");
        }
    }
});
