var client = require('../clients/ziptax.server.client.js').getClient(),
    CommonService = require('../services/sphere/sphere.commons.server.service.js'),
    Promise = require('bluebird');

module.exports = function (app) {
    var service = {};

    service.getTaxByZipCode = function (zipCode) {
        return new Promise(function (resolve, reject) {
            client.lookup(zipCode, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    var tax = result.results[0];
                    if (tax) {
                        //Keep this only as zip code validation now but assign 0 to all taxes
                        //resolve(tax.taxSales);
                        resolve(0);
                    }
                    else {
                        reject ("Invalid Zip Code. Please use a valid Zip Code.");
                    }

                }
            });
        });
    };

    service.setTaxValues = function (zipCode, cartId, version) {
        return new Promise(function (resolve, reject) {
            client.lookup(zipCode, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    var tax = result.results[0];
                    payload = {};
                    payload.action = "setCustomField";
                    payload.name = 'customTaxRate';
                    payload.value = tax.taxSales;
                    CommonService.updateWithVersion('carts', cartId, version, [payload], function (err, result) {
                        app.logger.debug('Updating line item: ' + result);
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    }

    service.setTaxToZero = function (cartId, version) {
        return new Promise(function (resolve, reject) {
            payload = {};
            payload.action = "setCustomField";
            payload.name = 'customTaxRate';
            payload.value = 0;
            CommonService.updateWithVersion('carts', cartId, version, [payload], function (err, result) {
                app.logger.debug('Updating line item: ' + result);
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    return service;
}

