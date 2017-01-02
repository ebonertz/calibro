
angular.module('carts').directive('prescriptionBox', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionBox.client.template.html',
        scope: false,
        transclude: true,
        replace: true,
        link: function ($scope, $element, $attrs) {
            // We don't want watches here!
            $element.find('h6').text($attrs.header);
            $element.css('width', Math.floor(100/$attrs.size - 1)+"%");
            $element.on('click', function(){
                $element.parent().find('.prescription-box').removeClass('selected');
                $element.addClass('selected');
            })
        }
    }
});


angular.module('carts').directive('prescriptionBoxBind', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionBoxBind.client.template.html',
        scope: {
          'header': '@',
          'content': '='
        },
        replace: true,
        link: function ($scope, $element, $attrs) {
            // We don't want watches here!
            // $element.css('width', Math.floor(100/$attrs.size)+"%");
            $element.css('width', Math.floor(100/($element.parent().children().length)) + "%");
        }
    }
});
