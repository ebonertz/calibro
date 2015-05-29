'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/customer/profile',
			templateUrl: 'modules/customers/views/settings/profile.client.view.html'
		}).
		state('addresses', {
			url: '/customer/addresses',
			templateUrl: 'modules/customers/views/settings/addresses.client.view.html'
		}).
		state('orderhistory', {
			url: '/customer/orderhistory',
			templateUrl: 'modules/customers/views/settings/order-history.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/customers/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/customers/views/settings/social-accounts.client.view.html'
		}).
		state('login', {
			url: '/login',
			templateUrl: 'modules/customers/views/authentication/login.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/customers/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/customers/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/customers/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/customers/views/password/reset-password.client.view.html'
		});
	}
]);