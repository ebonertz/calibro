var SphereClient = require('../../clients/sphere.server.client.js'),
    Commons = require('../commons.server.service.js'),
    config = require('../../../config/config');


module.exports = function (app) {
    var service = {};

    service.list = function (entity, callback) {
        SphereClient.getClient()[entity].all().expand('taxCategory').fetch().then(function (resultArray) {
            callback(null, resultArray.body.results);
        }).error(function (err) {
            app.logger.error("Error listing entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    };

    service.where = function (entity, query, callback) {
        SphereClient.getClient()[entity].where(query).fetch().then(function (resultArray) {
            callback(null, resultArray.body.results);
        }).error(function (err) {
            app.logger.error("Error executing where: %s,",JSON.stringify(err));
            callback(err, null);
        });
    };

    service.all = function (entity, callback) {
        SphereClient.getClient()[entity].all().fetch().then(function (resultArray) {
            callback(null, resultArray.body.results);
        }).error(function (err) {
            app.logger.error("Error fetching all entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    }


    service.create = function (entity, object, callback) {
        SphereClient.getClient()[entity].save(object).then(function (result) {
            app.logger.info(entity + " Object saved.");
            app.logger.debug(result.body);
            if (callback)
                callback(null, result.body);
        }).error(function (err) {
            app.logger.error("Error creating entity: %s. Error: %s",entity,JSON.stringify(err));
            if (callback)
                callback(err, null);
        });
    };

    service.delete = function (entity, id, callback) {
        SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
            SphereClient.getClient()[entity].byId(id).delete(result.body.version).then(function (result) {
                app.logger.info('Deleted %s ID %s', entity,id);
                if (callback)
                    callback(null, result.body)
            }).error(function (err) {
                app.logger.error("Error deleting entity: %s. Error: %s",entity,JSON.stringify(err));
                if (callback)
                    callback(err, null);
            });
        });
    };

    service.deleteAll = function (entity, callback) {
        SphereClient.getClient()[entity].all().fetch().then(function (resultArray) {
            for (var i = 0; i < resultArray.body.results.length; i++) {
                service.delete(entity, resultArray.body.results[i].id);
            }
            callback(null, {});
        }).error(function (err) {
            app.logger.error("Error deleting all entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err);
        });
    };


    service.byId = function (entity, id, callback) {
        SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
            callback(null, result.body);
        }).error(function (err) {
            app.logger.error("Error finding by id entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    };

    service.getBySlug = function (entity, slug, callback) {
        SphereClient.getClient()[entity].where('slug(en = "' + slug + '")').fetch().then(function (result) {
            callback(null, result.body);
        }).error(function (err) {
            app.logger.error("Error finding by slug entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    }

    service.byCustomer = function (entity, customerId, callback) {
        SphereClient.getClient()[entity].where('customerId="' + customerId + '"').all().fetch().then(function (result) {
            callback(null, result.body.results);
        }).error(function (err) {
            app.logger.error("Error finding by customer entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    };


    service.byName = function (entity, name, callback) {
        SphereClient.getClient()[entity].where('name="' + name + '"').fetch().then(function (result) {
            callback(null, result.body.results);
        }).error(function (err) {
            app.logger.error("Error finding by name entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    };

    service.update = function (entity, id, actions, callback) {
        SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
            SphereClient.getClient()[entity].byId(id).update({
                version: result.body.version,
                actions: actions
            }).then(function (result) {
                callback(null, result.body)
            }).error(function (err) {
                app.logger.error("Error updating entity: %s. Error: %s",entity,JSON.stringify(err));
                callback(err, null);
            });
        });
    };

    service.updateWithVersion = function (entity, id, version, actions, callback) {
        SphereClient.getClient()[entity].byId(id).update({
            version: version,
            actions: actions
        }).then(function (result) {
            callback(null, result.body)
        }).error(function (err) {
            app.logger.error("Error updating with version entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        });
    };

    service.post = function (entity, endpoint, payload, callback) {
        SphereClient.getClient()[entity]._save(endpoint, payload).then(function (result) {
            callback(null, result.body)
        }).error(function (err) {
            app.logger.error("Error saving entity: %s. Error: %s",entity,JSON.stringify(err));
            callback(err, null);
        })
    }

    service.get = function (entity, endpoint, callback) {
        SphereClient.getClient()[entity]._get(endpoint).then(function (result) {
            callback(null, result.body)
        }).error(function (err) {
            app.logger.error("Error getting entity: %s. Error: %s",entity,JSON.stringify(err));
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

    service.GET_ApiCall = function (entity, path, callback) {

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

    return service;
}



