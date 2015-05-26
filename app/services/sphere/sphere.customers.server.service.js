var SphereClient = require('../../clients/sphere.server.client.js');

/**
 * List
 */
exports.list = function (callback) {
    SphereClient.getClient().customers.all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.create = function (customer, callback) {
    SphereClient.getClient().customers.create(customer).then(function (result) {
        callback(null, result.body.customer);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.login = function (username, password, callback) {
    var customer = {
        "email": username,
        "password": password
    }

    SphereClient.getClient().authentication.save(customer).then(function (result) {
        callback(null, result.body.customer);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });

};

