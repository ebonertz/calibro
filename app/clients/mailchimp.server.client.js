var MailchimpClient,
    client,
    config = require('../../config/config'),

MailchimpClient = require('mailchimp-api');

client = new MailchimpClient.Mailchimp(config.mailchimp.key) 

exports.getClient = function() {
    return client;
}

exports.lists = config.mailchimp.lists