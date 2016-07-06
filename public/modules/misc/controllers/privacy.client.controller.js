'use strict';

angular.module('misc').controller('PrivacyController', ['$scope', 'Authentication','ContentfulService',
    function ($scope, Authentication,ContentfulService) {
        $scope.authentication = Authentication;

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('miscPage','Privacy Page').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);
