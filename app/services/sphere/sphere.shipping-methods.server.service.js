var SphereClient = require('../../clients/sphere.server.client.js'),
    CommonService = require('./sphere.commons.server.service.js'),
    entity = 'shipping-methods';


exports.byCart = function (cartId, callback) {
    var path = '?cartId=' + cartId;

    CommonService.GET_ApiCall(entity, path, function (err, data) {
        if (err)
            callback(err, null)
        else
            callback(null, data)
    });
};

exports.byLocation = function (country, state, currency, callback) {
    var path = '',
        params = [];

    if (country)
        params.push('country=' + country);
    if (state)
        params.push('state=' + state);
    if (currency)
        params.push('currency=' + currency);

    for (var i = 0; i < params.length; i++) {
        if (i == 0)
            path = '?' + params[i]
        else {
            path += '&' + params[i]
        }
    }

    console.log(path);

    CommonService.GET_ApiCall(entity, path, function (err, data) {
        if (err)
            callback(err, null)
        else
            callback(null, data)
    });
};


exports.byLocationOneCurrency = function (country, state, currency, zonename, callback) {

    CommonService.byName('zones', zonename, function (err, zone) {

        if (err || zone == null || zone.length == 0) {
            callback(new Error(err), null);
        } else {

            exports.byLocation(country, state, currency, function (err, result) {
                if (err)
                    callback(err, null)
                else {

                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < result[i].zoneRates.length; j++) {
                            if (result[i].zoneRates[j].zone.id != zone[0].id) {
                                result[i].zoneRates.splice(j, 1);
                            }
                        }
                    }


                    for (var i = 0; i < result.length; i++) {
                        for (var j = 0; j < result[i].zoneRates.length; j++) {

                            for (var k = 0; k < result[i].zoneRates[j].shippingRates.length; k++) {
                                if (result[i].zoneRates[j].shippingRates[k].price.currencyCode != currency) {
                                    result[i].zoneRates[j].shippingRates.splice(k, 1);
                                    break;
                                }
                            }
                        }
                    }

                    callback(null, result)
                }
            });
        }

    });


};
