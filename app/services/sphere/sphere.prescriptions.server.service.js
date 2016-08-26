'use strict';

var container = 'Prescriptions';

    module.exports = function (app) {
    var  CustomObjectService = require('./sphere.custom-objects.server.service.js')(app),
        CommonService = require('./sphere.commons.server.service.js') (app);

    var service = {};
    service.create = function(cartId,version, content, callback) {
        CustomObjectService.create(container, cartId, content, function (err, prescription) {
            var payload = {
                action: "setCustomType",
                typeKey: "orderCustomType",
                fields: {
                    prescriptionId: prescription.id
                }
            };
            CommonService.updateWithVersion('carts', cartId, version, [payload], function (err, cart) {
                app.logger.debug('Updating cart prescription id: ' + cart);
                if (err) {
                    callback(err,cart);
                } else {
                    var result = {
                        cart: cart,
                        prescription: prescription
                    };
                    callback(null,result);
                }
            });
        });
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
