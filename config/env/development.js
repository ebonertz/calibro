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
        "api_url": "api.sphere.io",
        "auth_url": "auth.sphere.io",
        "project_key": "reactionsphere-test",
        "client_id": "r_IHigKd7TDtvC7nX_XDIQYB",
        "client_secret": "nL9sXy3IGCB8tmn1k_oPNxTeZqH25UVw"
    },
    /*
     contenful: {
     space: 'wl86s32z4irf',
     accessToken: 'a4df0e89344a2951b7c2b91f86a16ef93044baf5125f17689505a380f773fa38',
     secure: true,
     host: 'cdn.contentful.com'
     },
     */
    contenful: {
        space: '6b721x8g60bf',
        accessToken: '7c3d6d88a6e7dcbbc1b7a586314714ee7551c4fea6b21d890bd0a267ab1e16d7',
        secure: true,
        host: 'cdn.contentful.com'
    },

    mailchimp: {
        key: 'bf21e8530000f313ca295c6be0bd98fe-us11',
        lists: {
            'newsletter': '8c5a60f754',
            'offers': '76ed47a5ac'
        }
    },
    mandrill: {
        key: 'cP6gybqxJGlJWMkAcvz5hw',
        options: {
            from_email: 'support@focalioptics.com',
            from_name: 'Focali Optics',
            contactus_email: 'support@focalioptics.com',
        },
        templates: {
            welcome: 'welcome',
            contactus: 'contact-us',
            passwordtoken: 'password-token',
            attachment: 'attachment',
            order: 'order'
        }
    },
    emails: {
        orders_export: 'focali.dev@gmail.com',
        prescriptions: 'focali.dev@gmail.com'
    },
    authorizenet: {
        apiLoginID: '78qH88Btv',
        transactionKey: '85k34Y4947T4pMkf',
        timeCorrection: 10773 // Matias
        // timeCorrection: 14373 // Luciano
        //timeCorrection: -7288  // Sebas
    },
    shipstation: {
        key: 'd9d40094ab3347db928e16f1199939ac',
        secret: 'f1a3cf70216e4743a3f844fe076774fb'
    },
    highIndex: {
        price: 30,
        slug: 'high-index-lens'
    },
    orderPrefix: 'TEST',
};
