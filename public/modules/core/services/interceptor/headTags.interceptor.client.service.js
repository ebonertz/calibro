'use strict';

angular.module('core').factory('headTagsInterceptor', ['$q', '$injector','lodash','$location',
    function ($q, $injector,_,$location) {

        // the following controllers have their own login to render meta tags
        var notProcessableControllers = ['ProductsShopController','ProductDetailController','ProductsBrandController'];

        //To determine what is the current url so that meta tags are changed only when the url changes. Subsequent
        //responses on the same url won't be processed
        var currentUrl =  $location.url();
        return {
            response: function(response) {
                if (typeof response.data.indexOf === 'function' && response.data.indexOf ('ng-controller') != -1
                    && currentUrl != $location.url ()) {
                    currentUrl =  $location.url();
                    var found = _.find (notProcessableControllers, function (item) {
                        return response.data.indexOf (item) != -1;
                    });
                    if (!found) {
                        var config = $injector.get('HeadDataService').headData();
                        if (config) {
                            $('title').text(config.title);
                            $('meta[name=description]').attr('content', config.description);
                        }

                    }
                }
                return response;
            }
        };
    }
]);
