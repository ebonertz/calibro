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

			$scope.ready = true;
		}
	}
})

.directive('productImages', function(){
	// Inserts product thumbnails
	return {
		scope: false,
		link: function($scope, $elem){

			// Flattens images from variants
			var flattenImages = function(variants){
				var images = [];
				variants.forEach(function(variant){
					variant.images.forEach(function(image){
						image.variantId = variant.id
					})
					images = images.concat(variant.images)
				})

				return images
			}

			var watcher = $scope.$watch('product', function(product){
				if(product && product.hasOwnProperty('variants') && product.variants.length > 0) {
					flattenImages(product.variants).forEach(function (img) {
						$elem.append('<a class="thumbnail-wrapper" variant-id="'+img.variantId+'">' +
							'<img class="thumbnail" src="' + img.url + '"  ng-mouseover="switchImageBig(\''+img.url+'\')" ' +
							'ng-mouseleave="switchImageBig('+img.url+')" class="thumbnail" data-url="\''+img.url+'\'" />' +
							'</a>')
					})

					// Unbind watcher
					watcher();
				}

				$scope.$watch('currentVariant', function(val){
					if(val && val['id']) {
						$elem.find('.thumbnail-wrapper').hide();
						$elem.find('.thumbnail-wrapper[variant-id=' + $scope.currentVariant.id + ']').show();
					}
				})
			})

		}
	}
})
