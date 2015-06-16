var SphereClient = require('../../clients/sphere.server.client.js');

exports.list = function (entity, callback) {
    SphereClient.getClient()[entity].all().expand('taxCategory').fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.where = function (entity, query, callback) {
    SphereClient.getClient()[entity].where(query).fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.all = function (entity, callback) {
    SphereClient.getClient()[entity].all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
}


exports.create = function (entity, object, callback) {
    SphereClient.getClient()[entity].save(object).then(function (result) {
        if (callback)
            callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        if (callback)
            callback(err, null);
    });
};

exports.delete = function (entity, id, callback) {
    SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
        SphereClient.getClient()[entity].byId(id).delete(result.body.version).then(function (result) {
            console.log('Deleted ' + entity + ' ID ' + id);
            if (callback)
                callback(null, result.body)
        }).error(function (err) {
            console.log(err);
            if (callback)
                callback(err, null);
        });
    });
};

exports.deleteAll = function (entity, callback) {
    SphereClient.getClient()[entity].all().fetch().then(function (resultArray) {
        for (var i = 0; i < resultArray.body.results.length; i++) {
            exports.delete(entity, resultArray.body.results[i].id);
        }
        callback(null, {});
    }).error(function (err) {
        console.log(err);
        callback(err);
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

exports.getBySlug = function (entity, slug, callback) {
    SphereClient.getClient()[entity].where('slug(en = "' + slug + '")').fetch().then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
}

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
