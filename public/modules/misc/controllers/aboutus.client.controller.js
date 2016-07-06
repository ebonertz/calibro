'use strict';

angular.module('misc').controller('AboutUsController', ['$scope', 'Authentication','ContentfulService',
    function ($scope, Authentication,ContentfulService) {
        $scope.authentication = Authentication;

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('aboutUsPage','About Us').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);
