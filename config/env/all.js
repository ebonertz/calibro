'use strict';

module.exports = {
	app: {
		title: 'focali-mean',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/optile/ajax-integration-1.1.min.css',
				'public/lib/angular-toastr/dist/angular-toastr.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/design/js/focali-required.js',
				'public/design/js/focali-scripts.js',
				'public/lib/optile/ajax-integration-1.1.min.js',
				'public/lib/angular-cookie/angular-cookie.min.js',
				'public/lib/angular-toastr/dist/angular-toastr.js',
				'public/lib/angular-bindonce/bindonce.js',
				'public/lib/angular-socialshare/angular-socialshare.min.js',
				'public/lib/angular-addthis/dist/angular-addthis.min.js',
				'public/lib/es5-shim/es5-shim.js',
				'public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'public/lib/ngprogress/build/ngprogress.js',
				'public/lib/angular-loading-bar/build/loading-bar.min.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/braintree-web/dist/braintree.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/lib/ngprogress/ngProgress.css',
			'public/lib/angular-loading-bar/build/loading-bar.min.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
