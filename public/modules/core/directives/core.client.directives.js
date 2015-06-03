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
                $(element[0].children[2].children[1]).fadeIn().removeClass('hidden');
            });

            $(element[0].children[2].children[1]).mouseleave(function () {
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


angular.module('core').directive('panelTrigger', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $(element).parent('.select').removeClass('active');
                $(this).parent('.select').addClass('active');
                var target = $(this).data('target');
                if(target)
                    $(element).load('modules/products/views/content-panels/' + target + '.client.view.html');
                return false;
            });

            $(element).click(function() {
                $(this).parents('.ex-panel').toggleClass('active');
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
                $('.block-radio').removeClass('checked');
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

