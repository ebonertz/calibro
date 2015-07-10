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

            callback(null, null);

        }
    });
};

exports.create = function(container, key, value, callback){
    var payload = {
        container: container,
        key: key,
        value: value,
    };
    CommonService.create('customObjects', payload, callback);
}
