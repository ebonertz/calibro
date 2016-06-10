var SphereClient = require('../../clients/sphere.server.client.js'),
    Commons = require('../commons.server.service.js'),
    config = require('../../../config/config');

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
        console.log(entity + " Object saved.");
        console.log(result.body);
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


exports.byName = function (entity, name, callback) {
    SphereClient.getClient()[entity].where('name="' + name + '"').fetch().then(function (result) {
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

exports.updateWithVersion = function (entity, id, version, actions, callback) {
    SphereClient.getClient()[entity].byId(id).update({
        version: version,
        actions: actions
    }).then(function (result) {
        callback(null, result.body)
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.post = function (entity, endpoint, payload, callback) {
    SphereClient.getClient()[entity]._save(endpoint, payload).then(function (result) {
        callback(null, result.body)
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    })
}

exports.get = function (entity, endpoint, callback) {
    SphereClient.getClient()[entity]._get(endpoint).then(function (result) {
        callback(null, result.body)
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    })
}


var getApiToken = function (callback) {

    var headers = {
        'Authorization': "Basic " + new Buffer(config.sphere.client_id + ':' + config.sphere.client_secret).toString('base64'),
        'Content-Length': 0
    };

    var endpoint = {
        "host": config.sphere.oauth_url,
        "path": "/oauth/token?grant_type=client_credentials&scope=manage_project:" + config.sphere.project_key,
        "method": "POST",
        "port": 443,
        "headers": headers
    };


    Commons.doRequest(endpoint, function (err, data) {
        if (err)
            callback(err, null)
        else
            callback(null, data)
    });

}

exports.GET_ApiCall = function (entity, path, callback) {

    getApiToken(function (err, token) {
        if (err) {
            callback(err, null)
        } else {
            var fullPath = '/' + config.sphere.project_key + '/' + entity + '/' + path;

            var headers = {
                'Authorization': token.token_type + ' ' + token.access_token
            };

            var endpoint = {
                "host": config.sphere.api_host,
                "path": fullPath,
                "method": "GET",
                "headers": headers
            };

            Commons.doRequest(endpoint, function (err, data) {
                if (err)
                    callback(err, null)
                else
                    callback(null, data)
            });
        }

    });

}



