
angular.module('carts').directive('prescriptionBox', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionBox.client.template.html',
        scope: false,
        transclude: true,
        replace: true,
        link: function ($scope, $element, $attrs) {
            // We don't want watches here!
            $element.find('.header').text($attrs.header);
            $element.css('width', Math.floor(100/$attrs.size - 1)+"%");
            //$element.find('.description').text($element.text);
            $element.on('click', function(){
                $element.parent().find('.prescription-box').removeClass('selected');
                $element.addClass('selected');
            })
        }
    }
});
