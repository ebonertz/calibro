'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Authentication', 'LoggerServices', '$http',
    function($scope, Authentication, LoggerServices, $http) {
        $scope.authentication = Authentication;

        $scope.subscribeToNewsletter = function(){
            // TODO prevent abuse
            var list = 'newsletter';
            var urlString = '/api/subscribe/'+list;
            var params = {email: $scope.newsletter.email}
            $http.post(urlString, params).success(function(result){
                var status = (result.toLowerCase() === 'true');
                if(status) {
                    LoggerServices.success("An email has been sent to you to complete the subscription");
                    $scope.newsletter = {}
                }else
                    LoggerServices.error("There was an error subscribing, please try again.")
            }).error(function(e){
                LoggerServices.error(e.error)
            });
        }

    }
]);
