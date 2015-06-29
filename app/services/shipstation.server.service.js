'use strict';

var domain = 'ssapi.shipstation.com',
    config = require("../../config/config.js"),
    https = require('https'),
    _ = require('lodash'),
    request = require('request');

var header;
exports.ship = function(order, callback){
    try {
        header = "Basic "+new Buffer(config.shipstation.key+":"+config.shipstation.secret, 'utf8').toString('base64');

        // Set billing address same to shipping address while we don't have this value (e.g. before going to Authorize.net)
        if(!order.billingAddress) order.billingAddress = order.shippingAddress

        // TODO: Use orderNumer instead of id
        // TODO: Add payment method?
        var post_data = {
            orderNumber: order.id,
            orderKey: order.id,
            orderDate: order.createdAt,
            orderStatus: order.paymentState == "Paid" ? 'awaiting_shipment' : 'awaiting_payment', // awaiting_payment, awaiting_shipment, shipped, on_hold, cancelled
            customerUsername: order.customerEmail,
            customerEmail: order.customerEmail,
            billTo: {
                name: buildName(order.billingAddress),
                company: order.billingAddress.company,
                street1: order.billingAddress.streetName,
                street2: order.billingAddress.streetNumber,
                street3: null,
                city: order.billingAddress.city,
                state: order.billingAddress.state ? order.billingAddress.state : null,
                postalCode: order.billingAddress.postalCode,
                country: order.billingAddress.country,
                phone: order.billingAddress.phone
            },
            shipTo: {
                name: buildName(order.shippingAddress),
                company: order.shippingAddress.company,
                street1: order.shippingAddress.streetName,
                street2: order.shippingAddress.streetNumber,
                street3: null,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state ? order.shippingAddress.state : null,
                postalCode: order.shippingAddress.postalCode,
                country: order.shippingAddress.country,
                phone: order.shippingAddress.phone,
            },
            items: buildItems(order.lineItems),
            amountPaid: order.totalPrice.centAmount/100,
            taxAmount: order.taxedPrice ? (order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount)/100 : null,
            shippingAmount: order.shippingInfo ? order.shippingInfo.price.centAmount/100 : null,
            requestedShippingService: order.shippingInfo ? order.shippingInfo.shippingMethodName : null,
        }

        var call_options = {
            url: 'https://'+domain+'/orders/createorder',
            method: "POST",
            json: true,
            body: post_data,
            headers: {
                "content-type": "application/json",
                'Authorization': header,
            },
        }

        request(call_options, function (error, response, body) {
            if(error){
                console.log(error)
                callback(error);
            }else if(response.statusCode != 200){
                callback(response.statusCode)
                console.log(body);
            }else{
                callback(null, body);
            }
        })
    }catch(e){
        console.log(e)
        callback(e)
    }
}

var buildName = function(address){
    var fullname = ""

    if(address.salutation)
        fullname += address.salutation + " "

    fullname += address.firstName + " " + address.lastName;

    return fullname
}

var buildItems = function(items){
    var shipItems = []
    items.forEach(function(item){
        shipItems.push({
            lineItemKey: item.id,
            sku: item.variant.sku,
            name: item.name.en,
            imageUrl: (item.variant.images.length > 0 ? item.variant.images[0].url : null),
            quantity: item.quantity,
            unitPrice: item.price.value.centAmount/100,
            //productId: item.productId,
        })
    })

    return shipItems;
}
