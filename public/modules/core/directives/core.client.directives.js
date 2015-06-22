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

angular.module('core').directive('topCart', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).mouseover(function () {
                //$('.cart-preview').fadeIn().removeClass('hidden');
                $(element[0].children[3].children[1]).fadeIn().removeClass('hidden');
            });

            $(element[0].children[3].children[1]).mouseleave(function () {
                $(this).fadeOut().addClass('hidden');
            });

        }
    }
});

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
