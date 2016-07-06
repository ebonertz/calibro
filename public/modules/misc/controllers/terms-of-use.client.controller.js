'use strict';

angular.module('misc').controller('TermsOfUseController', ['$scope', 'Authentication','ContentfulService',
    function ($scope, Authentication,ContentfulService) {
        $scope.authentication = Authentication;

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('miscPage','Terms of Use').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);
