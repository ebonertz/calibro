'use strict';

angular.module('misc').controller('HelpController', ['$scope', 'Authentication','ContentfulService',
    function ($scope, Authentication,ContentfulService) {
        $scope.authentication = Authentication;

        $scope.loadContent = function(page, args){
            console.log('Loading contentful data: '+page+'('+(args?args:'')+')')
            ContentfulService[page](args).then(function(data) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = data;
            });
        }
    }
]);
