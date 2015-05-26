var SphereClient = require('../clients/sphere.server.client');

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
        callback(null, result);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.login = function (username, password, callback) {

    var customer = {
        "type": "Customer",
        "id": "21a20188-d6ee-41cb-8eb7-e7bb53853337",
        "version": 1,
        "email": "random@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "password": "Jh8WCNe331tQCqOzxKmYYtdDC1er7epkSaCYzGwIRQo=$yU6OFfGIPxnN+gomxS06OQS0Q3EMuzz3qUIJrfsvCA8=",
        "addresses": [],
        "isEmailVerified": false,
        "createdAt": "2015-05-25T22:09:11.847Z",
        "lastModifiedAt": "2015-05-25T22:09:11.847Z"
    }

    callback(null, customer);

};

