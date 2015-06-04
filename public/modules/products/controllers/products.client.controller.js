'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ProductUtils',
  function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService, ProductUtils) {
    $scope.authentication = Authentication;

    $scope.lang = 'en';
    $scope.utils = ProductUtils

    // Find a list of Products
    $scope.find = function () {
      ProductService.list().then(function(resultsArray) {
        $scope.products = resultsArray;
      })
    };

    $scope.categoryAndSex = function (){
      var slug = $stateParams.slug

      var sex = $stateParams.sex;
      $scope.category = slug;
      $scope.sex = sex;

      // Both sexes will include unisex products 
      ProductService.getByCategorySlug(slug, sex+";unisex").then(function(productArray){
        $scope.products = productArray
      })
    }

    // Find existing Product
    $scope.findOne = function () {
      $scope.product = Products.get({
        productId: $stateParams.productId
      });
    };

    $scope.addToCart = function (product) {
      CartService.addToCart(product);
    };

    $scope.view = function(id){
      if(!id)
        id = $stateParams.id

      var products = new Products({id: id})
      products.$get({id: id}, function(result){
        $scope.product = result;
        $scope.currentVariant = $scope.product.masterVariant;
        $scope.product.variants.unshift($scope.product.masterVariant);
        $scope.selectedColor = $scope.currentVariant.attr.color[$scope.lang];

        // TODO: Fix price update when changing variant
        $scope.price = ProductUtils.renderPrice($scope.currentVariant, 'EUR');
        $scope.$watch(currentVariant, function(){
          $scope.price = ProductUtils.renderPrice($scope.currentVariant, 'EUR');
        })
        
      })
    };
  }
]);
