var client,
    config = require('../../config/config'),
    cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret

});

exports.getClient = function() {
    return cloudinary;
}
