'use strict';

var module = angular.module('products');

module.directive('productThumbnail', function ($rootScope) {
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
			$scope.product.displayVariant.isNew = false;
			for (var i = 0; i < $scope.product.displayVariant.attributes.length; i++) {
				if ($scope.product.displayVariant.attributes[i].name == "isNew") {
					$scope.product.displayVariant.isNew = true;
					break;
				}
			}

			$scope.ready = true;

			$scope.setProductSkuDisplay = function(sku){
				$rootScope.productSkuDisplay = sku;
			};
		}
	}
})

