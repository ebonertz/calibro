var SphereClient = require('../../clients/sphere.server.client.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    entity = 'customObjects';

exports.find = function (container, key, callback) {
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

exports.byId = function (container, key, callback) {
    SphereClient.getClient().customObjects.byId(container+'/'+key).fetch().then(function(result){
        callback(null, result.body)
    }).error(function(err){
        console.log(err)
        callback(err, null)
    })
}

exports.create = function(container, key, value, callback){
    var payload = {
        container: container,
        key: key,
        value: value,
    };
    CommonService.create('customObjects', payload, callback);
};

exports.delete = function(container, key, callback){
    SphereClient.getClient().customObjects.fetch(container+'/'+key).delete().then(function(result){
        callback(null, result)
    }).error(function(err){
        console.log(err)
        callback(err, null)
    })
}
