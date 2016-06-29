'use strict';

var container = 'Prescriptions';

module.exports = function (app) {
    var  CustomObjectService = require('./sphere.custom-objects.server.service.js')(app);
    var service = {};
    service.create = function(id, content, callback) {
        CustomObjectService.create(container, id, content, callback);
    };

    service.byId = function (id, callback) {
        CustomObjectService.byId(container, id, callback)
    };

    service.updateId = function (oldId, newId, callback) {
        service.byId(oldId, function(err, results){
            if(err){
                return err
            }else{
                var contents = results;
                CustomObjectService.delete(container, cartId, function(err, result){
                    if(err) return err
                    else {
                        service.create(newId, contents, callback)
                    }
                })
            }
        })
    }

    service.getLastUploadId = function(callback){
        CustomObjectService.find('Counters', container, function(err, result){
            if(err) callback(err)
            if(!result){
                service.startPrescriptionCount(callback)
            }else{
                callback(null, result)
            }
        })
    };

    service.startPrescriptionCount = function(callback){
        CustomObjectService.create('Counters', container, 1, callback);
    };

    service.updateLastUploadId = function(counter, callback){
        CustomObjectService.create('Counters', container, counter, callback);
    }

    return service;
}
