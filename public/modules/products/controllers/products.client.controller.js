'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ProductUtils',
  function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService, ProductUtils) {
    $scope.authentication = Authentication;

    $scope.FETCHING = false; // Will keep track of fetches
    $scope.lang = 'en';
    $scope.$utils = ProductUtils
    $scope.facetConfig = {
      'lensColor': {
        'type': 'lenum',
        'title': 'Lens Color'
      },
      'frameColor': {
        'type': 'lenum',
        'title': 'Frame Color'
      },
      'width': {
        'type': 'lenum',
        'title': 'Frame Width'
      },
      'frameShape': {
        'type': 'lenum',
        'title': 'Frame Shape'
      },
      'frameMaterial': {
        'type': 'ltext',
        'title': 'Frame Material'
      },

    }
    $scope.lenumFacets = ["width", "frameShape", "frameMaterial"];

    // Find a list of Products
    $scope.find = function () {
      ProductService.list().then(function(resultsArray) {
        $scope.products = resultsArray;
      })
    };

    $scope.categoryPage = function (){
      // Makes sure no other fetches are being executed at the same time
      if($scope.FETCHING){
        console.log('Already fetching')
        return
      }
      $scope.FETCHING = true;

      var slug, query, sex;

      // Get category slug
      var slug = $stateParams.slug
      $scope.category = slug; 
      $scope.productFilters = $scope.productFilters || {} // Init by default
      
      // Add sex to filters if found in stateParams (url)
      if($stateParams.sex){
        sex = $stateParams.sex;
        $scope.sex = sex;

        // Both sexes will include unisex products
        $scope.productFilters.sex = {} 
        $scope.productFilters.sex['UNISEX'] = true;
        $scope.productFilters.sex[sex.toUpperCase()] = true;
      }

      query = buildQuery();

      $scope.sort = {name: "ASC"}
      $scope.pageSize = $scope.pageSize || 1;
      $scope.pageNum = $scope.pageNum || 1; 

      $scope.pageTitle = $scope.sex ? $scope.sex+"'s "+$scope.category : $scope.category;

      var facets = Object.keys($scope.facetConfig)
      ProductService.getByCategorySlug(slug, query, facets, $scope.sort, $scope.byQuery, $scope.pageSize, $scope.pageNum).then(function(resultsArray){
        $scope.products = resultsArray.products
        $scope.facets = resultsArray.facets

        // Default displayVariant is masterVariant, but server might return other if color filters are being applied
        for(var i = 0; i < resultsArray.products.length; i++){
          $scope.products[i].displayVariant = $scope.products[i].displayVariant || $scope.products[i].masterVariant;
        }

        $scope.FETCHING = false;
      })
    }

    var buildQuery = function(){
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

      return query;
    }

    $scope.clearFilter = function(filterName){
      delete $scope.productFilters[filterName]
      $scope.requestFilter();
      return false;
    }

    $scope.sortBy = function(sortName){
      if($scope.FETCHING) // Avoid queing sort requests
        return

      var value = ($scope.sort[sortName] == "ASC" ? "DESC" : "ASC")
      $scope.sort = {}
      $scope.sort[sortName] = value
      $scope.categoryPage()
      return false;
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

        // Breadcrumbs
        $scope.breadcrumbs = {}
        $scope.breadcrumbs.category = $scope.product.categories[0].slug;

        if($scope.product.masterVariant.attr.sex){
          $scope.breadcrumbs.sub_category = {
            show: true,
            name: ($scope.product.masterVariant.attr.sex.key + "'s " + $scope.breadcrumbs.category).toLowerCase(),
            url: ("/#!/"+$scope.breadcrumbs.category+"/"+$scope.product.masterVariant.attr.sex.key).toLowerCase()
          }
        }

        // TODO: Fix price update when changing variant
        $scope.price = ProductUtils.renderPrice($scope.currentVariant.prices, 'EUR');
        // $scope.$watch(currentVariant, function(){
        //   $scope.price = ProductUtils.renderPrice($scope.currentVariant, 'EUR');
        // })
        
      })
    };

    // TODO: Move to service
    var variantsFromProduct = function(product){
      var variants = []
      var productCopy = angular.copy(product)

      delete productCopy.masterVariant
      delete productCopy.variants

      if(product.masterVariant){
        // Allow the variant to access the product
        product.masterVariant.product = productCopy
        product.masterVariant.priceString = ProductUtils.renderPrice(product.masterVariant, 'EUR')
        variants.push(product.masterVariant)
      }
      if(product.variants.length > 0){
        for(var i = 0; i < product.variants.length; i++){
          product.variants[i].product = productCopy
          product.variants[i].priceString = ProductUtils.renderPrice(product.variants[i], 'EUR')
        }
        variants = variants.concat(product.variants)
      }
      return variants;
    }
  }
]);
