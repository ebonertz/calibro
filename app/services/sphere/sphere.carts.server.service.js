var SphereClient = require('../../clients/sphere.server.client.js');


/**
 * List
 */
exports.list = function(callback) {
    SphereClient.getClient().carts.all().fetch().then(function(resultArray) {
        callback(null, resultArray.body.results);
    }).error(function(err) {
        console.log(err);
        callback(err, null);
    });
};


exports.create = function (cart, callback) {
    SphereClient.getClient().carts.save(cart).then(function (result) {
        callback(null, result);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};
