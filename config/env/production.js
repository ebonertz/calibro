'use strict';

module.exports = {
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/focali-mean',
	serverPath: process.env.SERVER_PATH,
	assets: {
		lib: {
			css: 'public/dist/vendor.min.css',
			js: 'public/dist/vendor.min.js'
		},
		css: 'public/dist/application.min.css',
		js: 'public/dist/application.min.js'
	},
	rememberMeKey: process.env.REMEMBER_ME_KEY,
	app: {
		title: 'Focali Optics',
		googleTagManagerKey: process.env.GOOGLE_TAG_KEY

	},
	facebook: {
		clientID: process.env.FACEBOOK_ID || 'APP_ID',
		clientSecret: process.env.FACEBOOK_SECRET || 'APP_SECRET',
		callbackURL: '/auth/facebook/callback'
	},
	twitter: {
		clientID: process.env.TWITTER_KEY || 'CONSUMER_KEY',
		clientSecret: process.env.TWITTER_SECRET || 'CONSUMER_SECRET',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: process.env.GOOGLE_ID || 'APP_ID',
		clientSecret: process.env.GOOGLE_SECRET || 'APP_SECRET',
		callbackURL: '/auth/google/callback'
	},
	linkedin: {
		clientID: process.env.LINKEDIN_ID || 'APP_ID',
		clientSecret: process.env.LINKEDIN_SECRET || 'APP_SECRET',
		callbackURL: '/auth/linkedin/callback'
	},
	github: {
		clientID: process.env.GITHUB_ID || 'APP_ID',
		clientSecret: process.env.GITHUB_SECRET || 'APP_SECRET',
		callbackURL: '/auth/github/callback'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	},
	sphere: {
		"api_url": process.env.SPHERE_API_URL,
		"auth_url": process.env.SPHERE_AUTH_URL,
		"project_key": process.env.SPHERE_PROJECT_KEY,
		"client_id": process.env.SPHERE_CLIENT_ID,
		"client_secret": process.env.SPHERE_CLIENT_SECRET,
		"product_types": {
			categories: "categories.id",
			lensColor: "variants.attributes.lensColor.key",
			frameColor: "variants.attributes.frameColor.key",
			price: "variants.price.centAmount",
			gender: "variants.attributes.gender.key",
			width: "variants.attributes.width.key",
			frameShape: "variants.attributes.frameShape.key",
			frameMaterial: "variants.attributes.frameMaterial.en",
			options:"variants.attributes.options.key",
			mirrorColor: "variants.attributes.mirrorColor.key"

		},
		"product_types_inv": {
			"categories.id": "categories",
			"variants.attributes.lensColor.key": "lensColor",
			"variants.attributes.frameColor.key": "frameColor",
			"variants.price.centAmount": "price",
			"variants.attributes.gender.key":"gender" ,
			"variants.attributes.width.key":"width",
			"variants.attributes.frameShape.key":"frameShape",
			"variants.attributes.frameMaterial.en":"frameMaterial",
			"variants.attributes.options.key":"options",
			"variants.attributes.mirrorColor.key": "mirrorColor"
		},
		"facets": [
			"categories.id",
			"variants.attributes.frameColor.key",
			"variants.attributes.width.key",
			"variants.attributes.frameShape.key",
			"variants.attributes.frameMaterial.en",
			"variants.attributes.lensColor.key",
			"variants.attributes.mirrorColor.key"
		]
	},
	contenful: {
		space: process.env.CONTENTFUL_SPACE,
		accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
		secure: true,
		host: process.env.CONTENTFUL_HOST,
	},
	braintree: {
		merchantId: process.env.BRAINTREE_MERCHANT_ID,
		publicKey: process.env.BRAINTREE_PUBLIC_KEY,
		privateKey: process.env.BRAINTREE_PRIVATE_KEY,
		environment: process.env.BRAINTREE_ENVIRONMENT || 'sandbox'

	},
	mailchimp: {
		key: process.env.MAILCHIMP_KEY,
		lists: {
			'newsletter': '8c5a60f754',
			'offers': '76ed47a5ac'
		}
	},
	mandrill: {
		key: process.env.MANDRILL_KEY,
		options: {
			from_email: process.env.MANDRILL_FROM_EMAIL,
			from_name: process.env.MANDRILL_FROM_NAME,
		},
		addresses: {
			contactus_email: 'support@focalioptics.com',
			prescriptions_email: 'support@focalioptics.com',
			orders_export: 'support@focalioptics.com',
		},
		templates: {
			welcome: 'welcome',
			contactus: 'contact-us',
			passwordtoken: 'password-token',
			attachment: 'attachment',
			order: 'order',
			orderConfirmation: 'orderconfirmation'
		}
	},
	highIndex: {
		price: 30,
		slug: 'high-index-lens'
	},
	blueBlock: {
			price: 20,
			slug: 'blue-block'
	},
	orderPrefix: 'FO',
	logger: {
		level: "debug"
	},
	papertrail: {
		host: 'logs3.papertrailapp.com',
		port: 16061
	},
	prerenderio: {
		token: process.env.PRERENDERIO_TOKEN
	},
	ziptax:{
		apikey: process.env.ZIP_API_KEY
	},
	cloudinary: {
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME
	}
};
