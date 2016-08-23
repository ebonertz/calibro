angular.module('core').directive('hero', function () {
    return {
        link: function (scope, element, attrs) {
            $(element).unslider({
                speed: 500,               //  The speed to animate each slide (in milliseconds)
                delay: 5000,              //  The delay between slide animations (in milliseconds)
                dots: true,               //  Display dot navigation
                fluid: true              //  Support responsive design. May break non-responsive designs
            });
        }
    }
});

angular.module('core').directive('cartFadeInClass', ['$detection', function ($detection) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var mobile = $detection.isAndroid() || $detection.isiOS() || $detection.isWindowsPhone() || $detection.isBB10();
            if (!mobile) {
                $(element).mouseover(function () {
                    //$('.cart-preview').fadeIn().removeClass('hidden');
                    $(element.parent().children()[1]).fadeIn().removeClass('hidden');
                });
                $(element).mouseleave(function () {
                    $(element.parent().children()[1]).addClass('hidden');
                });
            }


        }
    }
}]);

angular.module('core').directive('cartFadeOutClass', ['$detection', function ($detection) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var mobile = $detection.isAndroid() || $detection.isiOS() || $detection.isWindowsPhone() || $detection.isBB10();
            if (!mobile) {
                $(element).mouseleave(function () {
                    $(element).fadeOut().addClass('hidden');
                });
            }

        }
    }
}]);

angular.module('core').directive('priceRange', function () {
    return {
        link: function (scope, element, attrs) {

            $(element).noUiSlider({
                start: [0, 500],
                connect: true,
                range: {
                    'min': 0,
                    'max': 500
                }
            });

            $(element).Link('lower').to($('#range-number-min'), null, wNumb({
                decimals: 0
            }));
            $(element).Link('upper').to($('#range-number-max'), null, wNumb({
                decimals: 0
            }));

        }
    }
});

angular.module('core').directive('uicheckbox', function () {
    return {
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $(this).parent('label').toggleClass('checked');
            })
        }
    }
});

angular.module('core').directive('thumbnailWrapper', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $(element).removeClass('active');
                var url = $(this).data('url');
                $('.img-big img').fadeOut();
                setTimeout(function(){
                    $('.img-big img').attr('src', url);
                    $('.img-big img').fadeIn();

                },500);
                $(this).addClass('active');
                return false;
            });
        }
    }
});


angular.module('core').directive('panelLoader', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $('.select').removeClass('active');
                $(element).parent('.select').addClass('active');
                var target = $(this).data('target');
                if(target)
                    $('.product-panels').load('modules/products/views/content-panels/' + target + '.client.view.html');
                return false;
            });
        }
    }
});

angular.module('core').directive('panelTrigger', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                if($(this).parents('.ex-panel').attr('class').indexOf('disabled') == -1) {
                    $(this).parents('.ex-panel').toggleClass('active');
                }
                return false;
            });
        }
    }
});


angular.module('core').directive('blockRadio', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {

                var radios = $(this).parent().children();

                for(var i = 0; i < radios.length; i++) {
                    $(radios[i]).removeClass('checked');
                }

                $(this).addClass('checked');
            });
        }
    }
});

angular.module('core').directive('error', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).focus(function() {
                $(this).removeClass('error');
            });
        }
    }
});

angular.module('core').directive('select', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            $(element).on('change', function() {
                $(this).addClass('active');
            });

        }
    }
});

angular.module('core').directive('tab', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).click(function() {
                var target = $(this).data('tab');
                var openthis = '#' + target;
                $('.tab').removeClass('active');
                $('.tab-content').removeClass('active');
                $(openthis).addClass('active');
                $(element).addClass('active');
                return false;
            });

        }
    }
});

angular.module('core').directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                } else {
                    attrs.$set('src','/design/images/noimage.jpg');
                }
            });
        }
    }
});

angular.module('core').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

angular.module('core').directive('scrollTop', function() {
    return {
        restrict: 'A',
        link: function() {
            window.scrollTo(0,0);
        }
    }
});


angular.module('core').directive('addthisToolbox', ['$timeout','$location','$rootScope', function($timeout,$location,$rootScope) {
    return {
        restrict : 'A',
        transclude : true,
        replace : true,
        template : '<div ng-transclude></div>',
        link : function($scope, element, attrs) {
            addthis.init();
            setTimeout(function () {
                addthis.toolbox($(element).get(), {}, {
                    url:$location.absUrl(),
                    title : $rootScope.productShare? $rootScope.productShare.name.en:"",
                    description : $rootScope.productShare? $rootScope.productShare.description.en:""
                });
            },4000);
        }
    };
}]);
