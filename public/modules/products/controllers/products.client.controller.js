'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ProductUtils',
  function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService, ProductUtils) {
    $scope.authentication = Authentication;

    $scope.lang = 'en';
    $scope.utils = ProductUtils
    $scope.facetsArray = ["width", "frameShape"];

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
      $scope.productFilters = {sex: {MEN: true, UNISEX: true}};

      // Both sexes will include unisex products 
      var query = {
        sex: sex+";unisex"
      }

      $scope.byQuery = ['sex']

      var facets = $scope.facetsArray
      ProductService.getByCategorySlug(slug, query, facets, $scope.byQuery).then(function(resultsArray){
        $scope.products = resultsArray.products
        $scope.facets = resultsArray.facets

        // $scope.variants = []
        // for(var i = 0; i < resultsArray.products.length; i++){
        //   var product = resultsArray.products[i]

        //   if(product.masterVariant){
        //     // Allow the variant to access the product
        //     product.masterVariant.name = product.name;
        //     product.masterVariant.description = product.description;
        //     $scope.variants.push(product.masterVariant)
        //   }
        //   if(product.variants.length > 0){
        //     for(var i = 0; i < product.variants.length; i++){
        //       product.variants[i] = product;
        //       product.variants[i].name = product.name;
        //       product.variants[i].description = product.description;
        //     }
        //     $scope.variants = $scope.variants.concat(resultsArray.products[i].variants)
        //   }
        // }
        // console.log($scope.variants)
      })
    }

    $scope.requestFilter = function(){

      // Build query object
      var query = {}
      $scope.byQuery = []
      for(var filterKey in $scope.productFilters){
        var filter = $scope.productFilters[filterKey];

        for(var value in filter){
          // Add filter to query object if it has any true value
          if(filter[value]){
            if(query.hasOwnProperty(filterKey)){
              query[filterKey] = query[filterKey] + ";" + value
            }else{
              query[filterKey] = value
              $scope.byQuery.push(filterKey)
            }
          }
        }
      }

      ProductService.getByCategorySlug($scope.category, query, $scope.facetsArray, $scope.byQuery).then(function(resultsArray){
        $scope.products = resultsArray.products
        $scope.facets = resultsArray.facets

        // $scope.variants = []
        // for(var i = 0; i < resultsArray.products; i++){
        //   if(resultsArray.products[i].masterVariant){
        //     $scope.variants = $scope.variants.push(resultsArray.products[i].masterVariant)
        //   }
        //   if(resultsArray.products[i].variants.length > 0){
        //     $scope.variants = $scope.variants.concat(resultsArray.products[i].variants)
        //   }
        // }
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
