var ContenfulClient,
    client,
    config = require('../../config/config'),

ContenfulClient = require('contentful');

client = ContenfulClient.createClient({
    space: config.contenful.space,
    accessToken: config.contenful.accessToken,
    secure: config.contenful.secure,
    host: config.contenful.host
});

exports.getClient = function() {
    return client;
}
