var SphereClient = require('../../clients/sphere.server.client.js'),
    config = require('../../../config/config'),
    entity = 'orders',
    container = 'Orders';


module.exports = function (app) {
    var MandrillService = require('../mandrill.server.service.js')(app),
        CommonService = require('./sphere.commons.server.service.js')(app),
        CustomObjectService = require('./sphere.custom-objects.server.service.js')(app);

    var service = {};

    var actions = {
        changePaymentState: 'changePaymentState'
    }

    service.create = function (object, callback) {
        // Review high-index before creating the order

        // We need the next order number from counter container
        service.getOrderNumber(function(err, result){
            if(err) callback(err)
            else{
                var orderNumber = result + 1;
                object.orderNumber = config.orderPrefix+orderNumber.toString();

                CommonService.create(entity, object, function (err, orderCreated) {
                    if(err) {
                        // TODO: Find next order number instead of guessing one by one
                        if(String(err).indexOf("duplicate") > 0 && String(err).indexOf("orderNumber")){
                            // Hope getting to the expected order number
                            CustomObjectService.create('Counters', container, orderNumber);
                        }
                        callback(err, null);
                    } else {
                        // TODO: Some error control to assure CustomObject update
                        CustomObjectService.create('Counters', container, orderNumber);

                        CommonService.byId('customers', orderCreated.customerId, function (err, customer) {
                            if(!err && customer != null && customer.email != null) {
                                MandrillService.orderConfirmation(customer.email,orderCreated, config.serverPath + '/#!/orders/' + orderCreated.id);
                            }else{
                                app.logger.error("Error creating order. Error: %s",JSON.stringify(err));
                            }

                        });

                        callback(null, orderCreated);
                    }

                });
            }
        })

    }

    service.changePaymentState = function (orderId, payload, callback) {
        if (payload)
            payload.action = actions.changePaymentState;

        CommonService.update(entity, orderId, [payload], function (err, result) {
            callback(err, result);
        });
    }


    service.getOrderNumber = function(callback){
        CustomObjectService.find('Counters', container, function(err, result){
            if(err) callback(err)
            if(!result){
                service.startOrderNumber(callback)
            }else{
                var number = parseInt(result.value);
                if(typeof number !== "number") service.startOrderNumber(callback)
                else callback(null, number)
            }
        })
    };

// Start a new count if one couldn't be found
    service.startOrderNumber = function(callback){
        CustomObjectService.create('Counters', container, 1, function(err, result){
            if(err) callback(err);
            else callback(null, result.value)
        })
    }

    service.byId = function (id) {
        return SphereClient.getClient().orders.byId(id)
            .expand('paymentInfo.payments[*]').fetch().then(function (result) {
                return result.body;
            });
    };

    return service;
}
