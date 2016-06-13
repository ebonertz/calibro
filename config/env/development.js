    'use strict';

module.exports = {
    db: 'mongodb://localhost/focali-mean-dev',
    serverPath: 'http://localhost:3000',
    rememberMeKey: 'CmzvV20rf32IwFeReDhXBCzHtrB64qm8',
    app: {
        title: 'focali-mean - Development Environment'
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
        "api_host": "api.sphere.io",
        "oauth_url": "auth.sphere.io",
        "project_key": "reactionsphere-test",
        "client_id": "r_IHigKd7TDtvC7nX_XDIQYB",
        "client_secret": "nL9sXy3IGCB8tmn1k_oPNxTeZqH25UVw",
        "product_types": {
            categories: "categories.id",
            lensColor: "variants.attributes.lensColor.label.en",
            frameColor: "variants.attributes.frameColor.label.en",
            price: "variants.price.centAmount"
        },
        "product_types_inv": {
            "categories.id": "categories",
            "variants.attributes.lensColor.label.en": "lensColor",
            "variants.attributes.frameColor.label.en": "frameColor",
            "variants.price.centAmount": "price"
        },
        "facets": [
            "categories.id"
        ]
    },
    contenful: {
        space: '6b721x8g60bf',
        accessToken: '7c3d6d88a6e7dcbbc1b7a586314714ee7551c4fea6b21d890bd0a267ab1e16d7',
        secure: true,
        host: 'cdn.contentful.com'
    },
    braintree: {
        merchantId: "j6jnrqf6cysjmswf",
        publicKey: "65f59g3syk5y7mhz",
        privateKey: "70c126bc6db1b0fefb9715e358bcc836"
    },
    mailchimp: {
        key: 'bf21e8530000f313ca295c6be0bd98fe-us11',
        lists: {
            'newsletter': '8c5a60f754',
            'offers': '76ed47a5ac'
        }
    },
    mandrill: {
        key: 'cP6gybqxJGlJWMkAcvz5hw',//'G2aMt_7XNEFriFTfs1Otnw',
        options: {
            from_email: 'welcome@focalioptics.com',
            from_name: 'Focali Optics',
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
    authorizenet: {
        apiLoginID: '78qH88Btv',
        transactionKey: '85k34Y4947T4pMkf',
        timeCorrection: 10773 // Matias
        // timeCorrection: 14373 // Luciano
        //timeCorrection: -7288  // Sebas
    },
    highIndex: {
        price: 30,
        slug: 'high-index-lens'
    },
    orderPrefix: 'TEST',
    paypal: {
        host: 'api-3t.sandbox.paypal.com',
        exCheckCommUrl: 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=',
        username: 'support-facilitator_api1.devgurus.io',
        password: 'FGLD6522Y7K3ZBV8',
        signature: 'AFcWxV21C7fd0v3bYYYRCpSSRl31AwykjF3zYTfi7eN45MkbfB-y7x3A',
        returnUrl: 'http://localhost:3000/paypal/success',
        cancelUrl: 'http://localhost:3000/paypal/cancel'
    },
    payments: {
        errorUrl: '/#!/checkout?jumpto=billingMethod'
    }
};
