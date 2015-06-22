'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ContentfulService', '$stateParams', 'LoggerServices',
	function($scope, Authentication, ContentfulService, $stateParams, LoggerServices) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		if ($stateParams.hasOwnProperty('gender')) {
			$scope.gender = $stateParams.gender;
		}

		if ($stateParams.hasOwnProperty('slug')){
			$scope.slug = $stateParams.slug
		}

		$scope.loadContent = function(page, args){
			console.log('Loading contentful data: '+page+'('+args+')')
			ContentfulService[page](args).then(function(data) {
				$scope.contentfulData = data;
			});
		}

	}
]);
