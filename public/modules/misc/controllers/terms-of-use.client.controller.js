'use strict';

angular.module('misc').controller('TermsOfUseController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('miscPage','Terms of Use').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);
