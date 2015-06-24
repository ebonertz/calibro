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
        key: '9ec9ac7d7489e242cac5c26d0333aaeb-us11',
        lists: {
            'newsletter': '363d286358',
            'offers': 'f79541374a'
        }
    },
    mandrill: {
        key: 'G2aMt_7XNEFriFTfs1Otnw',
        options: {
            from_email: 'focali.dev@gmail.com',
            from_name: 'Focali',
            contactus_email: 'focali.dev@gmail.com',
        },
        templates: {
            welcome: 'welcome',
            contactus: 'contactus',
            passwordtoken: 'password-token',
            attachment: 'attachment',
            order: 'order'
        }
    },
    authorizenet: {
        timeCorrection: 10773 // Matias
        // timeCorrection: 14373 // Luciano
    }
};
