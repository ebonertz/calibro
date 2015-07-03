var MandrillService = require('../mandrill.server.service.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    CountryLookup = require('country-data').lookup,
    config = require('../../../config/config'),
    entity = 'orders';

var actions = {
    changePaymentState: 'changePaymentState'
}

exports.create = function (object, callback) {
    CommonService.create(entity, object, function (err, orderCreated) {
        if (err) {
            callback(err, null);
        } else {

            CommonService.byId('customers', orderCreated.customerId, function (err, customer) {
                if (!err && customer != null && customer.email != null)
                    MandrillService.orderCreated(customer.email, orderCreated.id, config.serverPath + '/#!/orders/' + orderCreated.id);
            });

            callback(null, orderCreated);
        }

    });
}

exports.changePaymentState = function (orderId, payload, callback) {
    if (payload)
        payload.action = actions.changePaymentState;

    CommonService.update(entity, orderId, [payload], function (err, result) {
        callback(err, result);
    });
}
