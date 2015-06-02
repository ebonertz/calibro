var SphereClient = require('../../clients/sphere.server.client.js');

/**
 * List
 */
exports.list = function (callback) {
    SphereClient.getClient().shippingMethods.all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};


exports.create = function (shippingMethod, callback) {
    SphereClient.getClient().shippingMethods.save(shippingMethod).then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byId = function (id, callback) {
    SphereClient.getClient().shippingMethods.byId(id).fetch().then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};
