'use strict';

module.exports = {
	app: {
		title: 'Focali Optics',
		description: 'Focali Optics',
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
				'public/lib/angular/angular.min.js',
				'public/lib/angular-resource/angular-resource.min.js',
				'public/lib/angular-cookies/angular-cookies.min.js',
				'public/lib/angular-animate/angular-animate.min.js',
				'public/lib/angular-touch/angular-touch.min.js',
				'public/lib/angular-sanitize/angular-sanitize.min.js',
				'public/lib/angular-ui-router/release/angular-ui-router.min.js',
				'public/lib/angular-ui-utils/ui-utils.min.js',
				'public/lib/jquery/dist/jquery.min.js',
				'public/design/js/focali-required.js',
				'public/design/js/focali-scripts.js',
				'public/lib/optile/ajax-integration-1.1.min.js',
				'public/lib/angular-cookie/angular-cookie.min.js',
				'public/lib/angular-toastr/dist/angular-toastr.tpls.min.js',
				'public/lib/angular-bindonce/bindonce.min.js',
				'public/lib/angular-socialshare/angular-socialshare.min.js',
				'public/lib/angular-addthis/dist/angular-addthis.min.js',
				'public/lib/es5-shim/es5-shim.min.js',
				'public/lib/ng-file-upload/ng-file-upload-all.min.js',
				'public/lib/ngprogress/build/ngprogress.min.js',
				'public/lib/angular-loading-bar/build/loading-bar.min.js',
				'public/lib/ng-lodash/build/ng-lodash.min.js',
				'public/lib/braintree-web/dist/braintree.js',
				'public/lib/stacktrace-js/dist/stacktrace.min.js',
				'public/lib/angular-adaptive-detection/angular-adaptive-detection.min.js',
				'public/lib/angular-marked/dist/angular-marked.min.js',
				'public/lib/marked/marked.min.js'
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
		shint: [
			'app/controllers/carts.server.controller.js',
			'app/services/sphere/sphere.carts.server.service.js',
			'app/services/sphere/sphere.commonsasync.server.service.js'
		],
		less: [
			'public/*/design/less/*.less',
			'public/design/css/main.less',
		],
		tests: {
			client: [
				'public/lib/angular-mocks/angular-mocks.js',
				'public/modules/*/specs/*.js'
			],
			server: [
				'app/**/specs/**/*.js'
			]

		}
	},
	contentful: {
		cache: {
			ttl: 1000,
			flushTimeout: 30
		}
	}
};
