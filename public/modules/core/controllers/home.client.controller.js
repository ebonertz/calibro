'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ContentfulService',
	function($scope, Authentication, ContentfulService) {
		// This provides Authentication context.
		$scope.authentication = Authentication;

		ContentfulService.home().then(function(data) {
			$scope.contentfulData = data;
		});

	}
]);
