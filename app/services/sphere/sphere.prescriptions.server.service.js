'use strict';

var CustomObjectService = require('./sphere.custom-objects.server.service.js'),
    container = 'Prescriptions';

exports.create = function(id, content, status, callback) {
    if(typeof status === 'function'){
        callback = status;
        status = 'cart';
    }

    content.status = status;

    CustomObjectService.create(container, id, content, callback);
};

exports.byId = function (id, callback) {
    CustomObjectService.find(container, id, callback)
};

exports.toOrder = function (cartId, orderId, callback) {
    exports.byId(cartId, function(err, results){
        if(err){
            return err
        }else{
            var contents = results;
            CustomObjectService.delete(container, cartId, function(err, result){
                if(err) return err
                else {
                    exports.create(orderId, contents, 'order', callback)
                }
            })
        }
    })
}
