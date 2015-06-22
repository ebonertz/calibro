'use strict';

var module = angular.module('products');

module.directive('productThumbnail', function () {
	return {
		templateUrl: 'modules/products/templates/product.client.template.html',
		restrict: 'E',
		scope: {
			product: '=',
			//currency: '=',
			//lang: '='
		},
		replace: true,
		link: function($scope){
			$scope.currency = 'USD'
			$scope.lang = 'en'

			if(!$scope.product.hasOwnProperty('displayVariant')){
				$scope.product.displayVariant = $scope.product.masterVariant;
			}
		}
	}
})
