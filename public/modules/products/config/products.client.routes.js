'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
    function ($stateProvider) {
    // Products state routing
    $stateProvider.

        state('viewProduct', {
          url: '/products/:id',
          templateUrl: 'modules/products/views/product-detail.client.view.html'
        }).

        /*
         * Categories
         */

        // General
        state('categoryProducts',{
          url: '/categories/:slug',
          templateUrl: 'modules/products/views/category-home.client.view.html'
        }).
        state('categoryGenderProducts',{
          url: '/categories/:gender/:slug',
          templateUrl: 'modules/products/views/category-products.client.view.html'
        });
  }
]);

