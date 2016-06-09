'use strict';

angular.module('misc').controller('ContactusController', ['$scope', 'Authentication', '$http',
    function ($scope, Authentication, $http) {
        $scope.authentication = Authentication;

        if($scope.authentication){
            $scope.contactUs = {}
            $scope.contactUs.email = $scope.authentication.user.email,
                $scope.contactUs.name = $scope.authentication.user.name
        }

        $scope.contactUsSubmit = function(valid){
            if(!valid){
                $scope.contactError = "Please fill in all the required fields"
                return;
            }

            var post_body = {
                name: $scope.contactUs.name,
                email: $scope.contactUs.email,
                message: $scope.contactUs.message
            }

            $http.post('/api/contactUs', post_body).success(function(result){
                $scope.contactSuccess = $scope.contactError = null;

                if(result.status == "sent"){
                    $scope.contactSuccess = "Message sent successfully. We'll get back to you as soon as possible!"

                    $scope.contactUs.message = ""
                }else{
                    $scope.contactError = "There was an error sending the email, please try again"
                }
            }).error(function(error){
                $scope.contactError = "We seem to be having troubles on our end, please try again later"
            })

        }
    }
]);
