'use strict';

angular.module('misc').controller('HelpController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(page, args){
            console.log('Loading contentful data: '+page+'('+(args?args:'')+')')
            ContentfulService[page](args).then(function(data) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = data;
            });
        }
    }
]);
