'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ContentfulService', '$stateParams', 'LoggerServices','$sce',
	function($scope, Authentication, ContentfulService, $stateParams, LoggerServices,$sce) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.lang = 'en';

		if ($stateParams.hasOwnProperty('gender')) {
			$scope.gender = $stateParams.gender;
		}

		if ($stateParams.hasOwnProperty('slug')){
			$scope.category = $stateParams.slug
		}

		ContentfulService.getView('home').then(function(view){
			$scope.view = view;
		})

	}
]);
