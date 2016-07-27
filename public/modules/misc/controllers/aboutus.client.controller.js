'use strict';

angular.module('misc').controller('AboutUsController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('aboutUsPage','About Us').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);
