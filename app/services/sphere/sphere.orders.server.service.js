var SphereClient = require('../../clients/sphere.server.client.js');

/**
 * List
 */
exports.list = function (callback) {
    SphereClient.getClient().orders.all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};


exports.create = function (order, callback) {
    SphereClient.getClient().orders.save(order).then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byId = function (id, callback) {
    SphereClient.getClient().orders.byId(id).fetch().then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byCustomer = function (customerId, callback) {
    SphereClient.getClient().orders
        .where('customerId="' + customerId + '"')
        .fetch().then(function (result) {
            callback(null, result.body.results);
        }).error(function (err) {
            console.log(err);
            callback(err, null);
        });
};
