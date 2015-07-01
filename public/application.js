'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		//$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
	}
]).run(function ($rootScope, CartService, CustomerService, $anchorScroll, $FB) {
	CartService.pageLoad();
	CustomerService.checkCookieAndLogin();
	//console.log(Authentication)
	//$rootScope.cart = CartService.createAnonymous();
	$rootScope.$on('$viewContentLoaded', function() {

		// Scroll to Top
		// Set ture for animation which isn't needed in my case
		$anchorScroll();

	});

	$FB.init('842679845809586');
});

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
