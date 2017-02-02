var SphereClient = require('../../clients/sphere.server.client.js'),
    entity = 'customObjects';


module.exports = function (app) {
    var CommonService = require('./sphere.commons.server.service.js') (app);

    var service = {};

    service.find = function (container, key, callback) {
        CommonService.where(entity, 'container="' + container + '"', function (err, resultArray) {
            if (err) {
                callback(err, null);
            } else {

                for (var i = 0; i < resultArray.length; i++) {
                    if (resultArray[i].key == key) {
                        callback(null, resultArray[i]);
                        return;
                    }
                }

                callback(new Error('Custom Object not found.'), null);

            }
        });
    };

    service.byId = function (container, key, callback) {
        SphereClient.getClient().customObjects.byId(container+'/'+key).fetch().then(function(result){
            callback(null, result.body)
        }).error(function(err){
          if ((err.body || {}).statusCode !== 404) {
            app.logger.error("Error finding by id custom objects %s",JSON.stringify(err));
          }
          callback(err, null);
        })
    }

    service.byCustomObjectId = function (id, callback) {
        SphereClient.getClient().customObjects.byId(id).fetch().then(function(result){
            callback(null, result.body)
        }).error(function(err){
          if (err.body.statusCode !== 404) {
            app.logger.error("Error finding by id custom objects %s",JSON.stringify(err));
          }
          callback(err, null);
        })
    }

    service.create = function(container, key, value, callback){
        var payload = {
            container: container,
            key: key,
            value: value,
        };
        CommonService.create('customObjects', payload, callback);
    };

    service.delete = function(container, key, callback){
        SphereClient.getClient().customObjects.fetch(container+'/'+key).delete().then(function(result){
            callback(null, result)
        }).error(function(err){
            app.logger.error("Error deleting custom objects %s",JSON.stringify(err));
            callback(err, null)
        })
    }

    return service;
}
