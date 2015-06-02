var SphereClient = require('../../clients/sphere.server.client.js');

exports.list = function (entity, callback) {
    SphereClient.getClient()[entity].all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};


exports.create = function (entity, object, callback) {
    SphereClient.getClient()[entity].save(object).then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byId = function (entity, id, callback) {
    SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byCustomer = function (entity, customerId, callback) {
    SphereClient.getClient()[entity].where('customerId="' + customerId + '"').fetch().then(function (result) {
        callback(null, result.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.update = function (entity, id, actions, callback) {
    SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
        SphereClient.getClient()[entity].byId(id).update({
            version: result.body.version,
            actions: actions
        }).then(function (result) {
            callback(null, result.body)
        }).error(function (err) {
            console.log(err);
            callback(err, null);
        });
    });
};
