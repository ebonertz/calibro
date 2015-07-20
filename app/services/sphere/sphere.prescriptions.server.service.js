'use strict';

var CustomObjectService = require('./sphere.custom-objects.server.service.js'),
    container = 'Prescriptions';

exports.create = function(id, content, callback) {
    CustomObjectService.create(container, id, content, callback);
};

exports.byId = function (id, callback) {
    CustomObjectService.byId(container, id, callback)
};

exports.updateId = function (oldId, newId, callback) {
    exports.byId(oldId, function(err, results){
        if(err){
            return err
        }else{
            var contents = results;
            CustomObjectService.delete(container, cartId, function(err, result){
                if(err) return err
                else {
                    exports.create(newId, contents, callback)
                }
            })
        }
    })
}

exports.getLastUploadId = function(callback){
    CustomObjectService.find('Counters', container, function(err, result){
        if(err) callback(err)
        if(!result){
            exports.startPrescriptionCount(callback)
        }else{
            callback(null, result)
        }
    })
};

exports.startPrescriptionCount = function(callback){
    CustomObjectService.create('Counters', container, 1, callback);
};

exports.updateLastUploadId = function(counter, callback){
    CustomObjectService.create('Counters', container, counter, callback);
}
