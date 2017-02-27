var _ = require('lodash'),
    request = require('request'),
    config = require('../../config/config'),
    Promise = require('bluebird');

module.exports = function (app) {
    var ChannelService = require('./sphere/sphere.channels.server.service')(app);
    var ProductService = Promise.promisifyAll(require('./sphere/sphere.products.server.service')(app));

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
                return calculateLineItems(cart).then (function (lineItems) {
                    bodyObject.Lines = lineItems;
                    return bodyObject;
                }).then (function (bodyObject) {
                     return sendRequest (bodyObject,cart.id);
                });
            case service.SHIPPING_TAX:
                return calculateShippingItem(cart).then (function (shippingLineItem) {
                    bodyObject.Lines.push(shippingLineItem);
                    return bodyObject;
                }).then (function (bodyObject) {
                    return sendRequest (bodyObject,cart.id);
                });
            case service.BOTH_TAX:
                return calculateLineItems(cart).then (function (shippingLineItem) {
                    bodyObject.Lines = shippingLineItem;
                    return calculateShippingItem(cart).then (function (shippingLineItem) {
                        bodyObject.Lines.push(shippingLineItem);
                        return sendRequest(bodyObject, cart.id);
                    });
                });

        }


    };

    function sendRequest (bodyObject,cartId) {
        var options = REQUEST_OPTIONS;
        options.body = JSON.stringify (bodyObject);
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                var result = JSON.parse (body);
                if (error) {
                    app.logger.warn ("Error calculating Avalara tax %s", JSON.stringify(error));
                    reject("There was a problem calculating taxes");
                }
                else if (result.ResultCode === "Success") {
                    _.each (result.TaxLines, function (taxLine, index) {
                        app.logger.debug ("Tax line %s for cart %s is %s", index, cartId, taxLine.Rate);
                    });
                    if (result.TaxLines.length > 1) {
                        app.logger.debug ("Cart cart %s has %s tax lines", cartId, result.TaxLines.length);
                    }
                    resolve(result);
                }
                else {
                    app.logger.warn (result.Messages[0].Details);
                    reject("There was a problem calculating taxes: "+result.Messages[0].Details);
                }
            });
        });
    }

    // TODO: Review the product call, this info could already be retrieved through the cart
    function calculateLineItems(cart) {
      var lineItems = [];
      return Promise.map(cart.lineItems, function(item) {
        return ChannelService.byId(item.distributionChannel.id).then(function(distributionChannel) {
          return ProductService.byIdAsync(item.productId).then(function(product) {

            var taxCode;
            if (distributionChannel.key == 'nonprescription') {
              if (product.categories[0].obj.slug.en === 'eyeglasses') {
                taxCode = config.avalara.nonPrescriptionEyewearTaxCode;
              } else {
                taxCode = config.avalara.nonPrescriptionSunglassTaxCode;
              }
            } else if (distributionChannel.key == 'singlevision') {
              if (product.categories[0].obj.slug.en === 'eyeglasses') {
                taxCode = config.avalara.prescriptionEyewearTaxCode;
              } else {
                taxCode = config.avalara.prescriptionSunglassTaxCode;
              }
            }

            return {
              "LineNo": item.id,
              "DestinationCode": cart.shippingAddress.id,
              "OriginCode": ORIGIN_ADDRESS.AddressCode,
              "Qty": item.quantity,
              "Amount": Number(parseInt(item.totalPrice.centAmount / 100).toFixed(0)),
              "Description": item.name.en,
              "ItemCode": item.productSlug.en,
              "TaxCode": taxCode
            };
          })
        })
      }).then(function(lineItems) {
        return lineItems;
      }).catch(function(error) {
        app.logger.error("Error calculating Avalara taxes %s", JSON.stringify(error));
        throw new Error("There was an error calculating the taxes, please try again later or contact us for support.")
      });
    }
    
    function calculateShippingItem (cart) {
       var item = {
            "LineNo": 1,
            "DestinationCode": cart.shippingAddress.id,
            "OriginCode": ORIGIN_ADDRESS.AddressCode,
            "Qty": 1,
            "TaxCode": "FR",
            "Amount": Number(parseInt(cart.shippingInfo.price.centAmount / 100).toFixed(0)),
            "Description": cart.shippingInfo.shippingMethodName
        };
        return Promise.resolve(item);
    }

    return service;
}
