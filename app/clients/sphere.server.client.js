var SphereClient = require('sphere-node-sdk').SphereClient,
  SphereHttpError = require('sphere-node-sdk').Errors.SphereHttpError,
  client,
  config = require('../../config/config'),

client = new SphereClient({
    config: {
        project_key: config.sphere.project_key,
        client_id: config.sphere.client_id,
        client_secret: config.sphere.client_secret
    },
    host: config.sphere.api_url,
    oauth_host: config.sphere.auth_url,
    user_agent: 'sphere-node-sdk'
});

exports.getClient = function() {
    return client;
}

exports.setClient = function() {
    client = new SphereClient({
        config: {
            project_key: config.sphere.project_key,
            client_id: config.sphere.client_id,
            client_secret: config.sphere.client_secret
        },
        host: config.sphere.api_url,
        oauth_host: config.sphere.auth_url,
        user_agent: 'sphere-node-sdk'

    });
}

exports.SphereHttpError = SphereHttpError;
