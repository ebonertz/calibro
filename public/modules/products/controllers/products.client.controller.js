'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ProductUtils', 'ContentfulService',
  function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService, ProductUtils, ContentfulService) {
    $scope.authentication = Authentication;
    $scope.$location = $location;

    $scope.FETCHING = false; // Will keep track of fetches
    $scope.lang = 'en';
    $scope.currency = 'USD';
    
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

    $scope.categoryPage = function (options){
      options = options || {}

      // Makes sure no other fetches are being executed at the same time
      if($scope.FETCHING){
        console.log('Already fetching')
        return
      }
      try {
        $scope.FETCHING = true;

        var query, gender;

        // Get category slug
        var slug = $stateParams.slug
        $scope.category = slug;
        $scope.productFilters = $scope.productFilters || {} // Init by default

        // Add gender to filters if found in stateParams (url)
        if($stateParams.gender){
          gender = $stateParams.gender;
          $scope.gender = gender;

          // Both genders will include unisex products
          $scope.productFilters.gender = {}
          $scope.productFilters.gender['UNISEX'] = true;
          $scope.productFilters.gender[gender.toUpperCase()] = true;
        }

        query = buildQuery();

        $scope.sort = $scope.sort || {name: "ASC"}
        $scope.pageSize = $scope.pageSize || 20; // TODO: Move to config
        $scope.pageNum = options.pageNum || 1;

        $scope.pageTitle = $scope.gender ? $scope.gender+"'s "+$scope.category : $scope.category;

        var facets = Object.keys($scope.facetConfig)
        ProductService.getByCategorySlug(slug, query, facets, $scope.sort, $scope.byQuery, $scope.pageSize, $scope.pageNum).then(function(resultsArray){
          $scope.products = resultsArray.products
          $scope.facets = resultsArray.facets

          $scope.pageSize = resultsArray.pages.perPage || $scope.pageSize;
          $scope.pageNum = resultsArray.pages.current || $scope.pageNum;
          $scope.totalPages = resultsArray.pages.total;

          // For ng-repeat
          $scope.pageRange = new Array($scope.totalPages);

          // Default displayVariant is masterVariant, but server might return other if color filters are being applied
          for(var i = 0; i < resultsArray.products.length; i++){
            $scope.products[i].displayVariant = $scope.products[i].displayVariant || $scope.products[i].masterVariant;
          }


        })
      }catch(e){
        console.log(e)
      }finally{
        $scope.FETCHING = false;
      }
    }

    $scope.getCategory = function(){
      var slug = $stateParams.slug
      return slug
    }

    $scope.fetchRecommendedProducts = function(category, gender, pageSize){
      var promise = new Promise(function(resolve, reject){
        var products = {}

        if(!category){
          return
        }

        if(gender){
          $scope.query = {gender: gender}
        }else{
          $scope.query = {}
        }
        
        $scope.sort = {}
        $scope.pageSize = pageSize || 5;
        ProductService.getByCategorySlug(category, $scope.query, {}, $scope.sort, {}, $scope.pageSize, 1).then(function(resultsArray){
          if(resultsArray.products.length > 0){
            products = resultsArray.products
          }

          resolve(products)
        })
      })

      return promise;
    }

    var buildQuery = function(){
      // Build query object
      var query = {}
      $scope.byQuery = []
      for(var filterKey in $scope.productFilters){
        var filter = $scope.productFilters[filterKey];

        if(typeof filter === "string"){
          query[filterKey] = filter;
          $scope.byQuery.push(filterKey)
        }else{
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
      }

      return query;
    }

    $scope.clearFilter = function(filterName){
      delete $scope.productFilters[filterName]
      $scope.categoryPage();
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

    $scope.quantity = 1;

    $scope.incrementQuantity = function(){
      $scope.quantity ++;
    }

    $scope.decrementQuantity = function(){
      if($scope.quantity > 1)
        $scope.quantity --;
    }

    $scope.addToCart = function () {
      CartService.addToCart($scope.product.id, $scope.currentVariant.id, $scope.quantity );
    };

    $scope.view = function(id){
      if(!id)
        id = $stateParams.id

      $scope.recommendedProducts = []

      var products = new Products({id: id})
      products.$get({id: id}, function(result){
        $scope.product = result;
        $scope.currentVariant = $scope.product.masterVariant;
        $scope.product.variants.unshift($scope.product.masterVariant);
        $scope.selectedColor = $scope.currentVariant.attr.color[$scope.lang];

        // Breadcrumbs
        $scope.breadcrumbs = {}
        $scope.breadcrumbs.category = $scope.product.categories[0].slug;

        if($scope.product.masterVariant.attr.gender){
          $scope.breadcrumbs.sub_category = {
            show: true,
            name: ($scope.product.masterVariant.attr.gender.key + "'s " + $scope.breadcrumbs.category).toLowerCase(),
            url: ("/#!/"+$scope.product.masterVariant.attr.gender.key+"/"+$scope.breadcrumbs.category).toLowerCase()
          }
        }

        $scope.fetchRecommendedProducts($scope.product.categories[0].slug, $scope.product.masterVariant.attr.gender.key)
        .then(function(result){
          $scope.$apply(function(){
            $scope.recommendedProducts = result
          })
        })
      })
    };
  }
]);
