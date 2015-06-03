'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
  function ($stateProvider) {
    // Products state routing
    $stateProvider.
    state('eyewear', {
        url: '/eyewear',
        templateUrl: 'modules/products/views/eyewear.client.view.html'
    }).
    state('men-eyewear', {
        url: '/men-eyewear',
        templateUrl: 'modules/products/views/men-eyewear.client.view.html'
    }).
    state('women-eyewear', {
        url: '/women-eyewear',
        templateUrl: 'modules/products/views/women-eyewear.client.view.html'
    }).
    state('men-sunglasses', {
        url: '/men-sunglasses',
        templateUrl: 'modules/products/views/men-sunglasses.client.view.html'
    }).
    state('women-sunglasses', {
        url: '/women-sunglasses',
        templateUrl: 'modules/products/views/women-sunglasses.client.view.html'
    }).
    state('men-summer', {
        url: '/men-summer',
        templateUrl: 'modules/products/views/men-summer.client.view.html'
    }).
    state('women-summer', {
        url: '/women-summer',
        templateUrl: 'modules/products/views/women-summer.client.view.html'
    }).
    state('product-detail', {
        url: '/product-detail/:id',
        templateUrl: 'modules/products/views/product-detail.client.view.html'
    }).
    state('listProducts', {
        url: '/products',
        templateUrl: 'modules/products/views/list-products.client.view.html'
    }).
    state('createProduct', {
        url: '/products/create',
        templateUrl: 'modules/products/views/create-product.client.view.html'
    }).
    state('viewProduct', {
        url: '/products/:id',
        templateUrl: 'modules/products/views/view-product.client.view.html'
    }).
    state('categoryProducts',{
        url: '/categories/:sex/:slug',
        templateUrl: 'modules/products/views/category-products.client.view.html'
    });
  }
]);

