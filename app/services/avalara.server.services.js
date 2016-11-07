var _ = require('lodash'),
    request = require('request')
config = require('../../config/config'),
    Promise = require('bluebird');

module.exports = function (app) {
    var service = {};
    service.LINE_ITEM_TAX = 1;
    service.SHIPPING_TAX = 2;
    service.BOTH_TAX = 3;
    var ORIGIN_ADDRESS = {
        "AddressCode": 1,
        "Line1": "591 Thornton Rd Ste P",
        "City": "Lithia Springs",
        "Region": "GA",
        "PostalCode": "30122-1546"

    };
    var REQUEST_OPTIONS = {
        method: 'POST',
        url: config.avalara.url,
        headers: {
            'Content-Type': 'text/json',
            'Authorization': 'Basic ' + config.avalara.key

        }
    };
    service.getSalesOrderTax = function (cart,type) {
        var options = REQUEST_OPTIONS;
        var bodyObject = {
            "DocDate": (new Date()).toISOString().slice(0, 10),
            "CustomerCode": cart.customerId || "anonymous",
            "DocCode": cart.id,
            "Commit": type === service.BOTH_TAX ? true : false,
            "DocType": type === service.BOTH_TAX ? "SalesInvoice":"SalesOrder",
            "Addresses": [{
                "AddressCode": cart.shippingAddress.id,
                "Line1": cart.shippingAddress.streetName,
                "City": cart.shippingAddress.city,
                "Region": cart.shippingAddress.state,
                "PostalCode": cart.shippingAddress.postalCode
            }, ORIGIN_ADDRESS],
            "Lines": []
        };
        switch (type) {
            case service.LINE_ITEM_TAX:
                bodyObject.Lines = calculateLineItems(cart);
                break;
            case service.SHIPPING_TAX:
                bodyObject.Lines.push(calculateShippingItem(cart));
                break;
            case service.BOTH_TAX:
                bodyObject.Lines = calculateLineItems(cart);
                bodyObject.Lines.push(calculateShippingItem(cart));
                break;

        }
        options.body = JSON.stringify (bodyObject);
        app.logger.debug ("Avalara request: %s",options.body);
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                var result = JSON.parse (body);
                app.logger.debug ("Avalara response: %s",result);

                if (error) {
                    app.logger.warn ("Error calculating Avalara tax %s", JSON.stringify(error));
                    reject("There was a problem calculating taxes");
                }
                else if (result.ResultCode === "Success") {
                    _.each (result.TaxLines, function (taxLine, index) {
                        app.logger.debug ("Tax line %s for cart %s is %s", index, cart.id, taxLine.Rate);
                    });
                    if (result.TaxLines.length > 1) {
                        app.logger.debug ("Cart cart %s has %s tax lines", cart.id, result.TaxLines.length);
                    }
                    resolve(result.TaxLines[0].Rate);
                }
                else {
                    app.logger.warn (result.Messages[0].Details);
                    reject("There was a problem calculating taxes: "+result.Messages[0].Details);
                }
            });
        });

    };

    function calculateLineItems (cart) {
        var lineItems = [];
        _.each (cart.lineItems, function (item) {
            lineItems.push({
                "LineNo": item.id,
                "DestinationCode": cart.shippingAddress.id,
                "OriginCode": ORIGIN_ADDRESS.AddressCode,
                "Qty": item.quantity,
                "Amount": Number(parseInt(item.totalPrice.centAmount / 100).toFixed(0)),
                "Description": item.name.en,
                "ItemCode": item.productSlug.en
            });
        });
        return lineItems;
    }
    function calculateShippingItem (cart) {
       return {
            "LineNo": 1,
            "DestinationCode": cart.shippingAddress.id,
            "OriginCode": ORIGIN_ADDRESS.AddressCode,
            "Qty": 1,
            "TaxCode": "FR",
            "Amount": Number(parseInt(cart.shippingInfo.price.centAmount / 100).toFixed(0)),
            "Description": cart.shippingInfo.shippingMethodName
        };
    }
    return service;
}
