'use strict';

module.exports = {
    serverPath: process.env.SERVER_PATH || 'http://focali-stage.ct-app.com/',
    rememberMeKey: 'CmzvV20rf32IwFeReDhXBCzHtrB64qm8',
    app: {
        title: 'Focali Optics'+process.env.NODE_ENV,
        googleTagManagerKey: 'GTM-THL5RH'

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
        "api_url": process.env.SPHERE_API_URL || "api.commercetools.co",
        "auth_url": process.env.SPHERE_AUTH_URL || "auth.commercetools.co",
        "project_key": process.env.SPHERE_PROJECT_KEY || "focali-stage",
        "client_id": process.env.SPHERE_CLIENT_ID || "iqRSwXQh_ITTkTR8Pf87rR1u",
        "client_secret": process.env.SPHERE_CLIENT_SECRET || "Yn8Jcws_CtkzZHnaz1go4shoAeBt8A0-",
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
        space: '6b721x8g60bf',
        accessToken: '73442aacb2db7bd511319cd4ae77f8f86cc352c47bfddbe459eb9decb015c4b6',
        secure: true,
        host: 'preview.contentful.com'
    },
    braintree: {
        merchantId: process.env.BRAINTREE_MERCHANT_ID || "j6jnrqf6cysjmswf",
        publicKey: process.env.BRAINTREE_PUBLIC_KEY || "65f59g3syk5y7mhz",
        privateKey: process.env.BRAINTREE_PRIVATE_KEY || "70c126bc6db1b0fefb9715e358bcc836",
        environment: process.env.BRAINTREE_ENVIRONMENT || 'sandbox'
    },
    mailchimp: {
        key: 'bf21e8530000f313ca295c6be0bd98fe-us11',
        lists: {
            'newsletter': '8c5a60f754',
            'offers': '76ed47a5ac'
        }
    },
    mandrill: {
        key: 'gpmiHrASlEYrO6WNjYDC7A',//'G2aMt_7XNEFriFTfs1Otnw',
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
    cloudinary: {
        api_key: process.env.CLOUDINARY_API_KEY || "317299721992649",
        api_secret: process.env.CLOUDINARY_API_SECRET || "k4HCOKsvs9YHDUJWAmF2OL7180o",
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME ||"dswl4guqu"
    },
    avalara: {
        key: process.env.AVALARA_API_KEY || "MjAwMDE4OTY4Nzo3MkExQzhGNUU2MjE3Njg3",
        url: process.env.AVALARA_URL || "https://development.avalara.net/1.0/tax/get",
        prescriptionSunglassTaxCode: process.env.PRESCRIPTION_SUNGLASS_TAX_CODE || "PH050460",
        nonPrescriptionSunglassTaxCode: process.env.NONPRESCRIPTION_SUNGLASS_TAX_CODE || "PH050461",
        prescriptionEyewearTaxCode: process.env.PRESCRIPTION_EYEWEAR_TAX_CODE || "PH150132",
        nonPrescriptionEyewearTaxCode: process.env.NONPRESCRIPTION_EYEWEAR_TAX_CODE || "PH150131"
    }

};
