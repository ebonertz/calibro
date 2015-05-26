var SphereClient,
    client,
    config = require('../../config/config'),

SphereClient = require('sphere-node-sdk').SphereClient;

client = new SphereClient({
    config: {
        project_key: config.sphere.project_key,
        client_id: config.sphere.client_id,
        client_secret: config.sphere.client_secret
    },
    user_agent: 'sphere-node-sdk'
});

exports.getClient = function() {
    return client;
}
