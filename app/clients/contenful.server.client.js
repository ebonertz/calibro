var ContenfulClient,
    client,
    config = require('../../config/config'),

ContenfulClient = require('contentful');

function initClient() {
  client = ContenfulClient.createClient({
      space: config.contenful.space,
      accessToken: config.contenful.accessToken,
      secure: config.contenful.secure,
      host: config.contenful.host
  });

  return client;
}


exports.getClient = function() {
    return client || initClient();
}
