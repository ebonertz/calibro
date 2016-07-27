'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ContentfulService', '$stateParams', 'LoggerServices','$sce',
	function($scope, Authentication, ContentfulService, $stateParams, LoggerServices,$sce) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.lang = 'en';

		$scope.trustAsHtml = function (string) {
			return $sce.trustAsHtml(string);
		};

		if ($stateParams.hasOwnProperty('gender')) {
			$scope.gender = $stateParams.gender;
		}

		if ($stateParams.hasOwnProperty('slug')){
			$scope.category = $stateParams.slug
		}

		$scope.loadContent = function(page, args){
			console.log('Loading contentful data: '+page+'('+(args?args:'')+')')
			ContentfulService[page](args).then(function(data) {
				console.log('Contentful page loaded.')
				$scope.contentfulData = data;
			});
		}

	}
]);
