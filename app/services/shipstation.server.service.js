'use strict';

var PrescriptionService = require('./sphere/sphere.prescriptions.server.service.js'),
    domain = 'ssapi.shipstation.com',
    config = require("../../config/config.js"),
    https = require('https'),
    _ = require('lodash'),
    request = require('request');


var getHeader = function(){
    return "Basic "+new Buffer(config.shipstation.key+":"+config.shipstation.secret, 'utf8').toString('base64');
}

exports.ship = function(order, callback){
    var header = getHeader();

    // Set billing address same to shipping address while we don't have this value (e.g. before going to Authorize.net)
    if(!order.billingAddress) order.billingAddress = order.shippingAddress;

    // TODO: Add payment method
    prescriptionToString(order.id, order.customerEmail).then(function(prescriptionString){
        var post_data = {
            orderNumber: order.orderNumber,
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
            items: buildItems(order),
            amountPaid: order.taxedPrice.totalGross.centAmount/100,
            taxAmount: order.taxedPrice ? (order.taxedPrice.totalGross.centAmount - order.taxedPrice.totalNet.centAmount)/100 : null,
            shippingAmount: order.shippingInfo ? order.shippingInfo.price.centAmount/100 : null,
            requestedShippingService: order.shippingInfo ? order.shippingInfo.shippingMethodName : null,
            customerNotes: 'High-index Lens: ' + (hasHighIndex(order) ? 'Yes' : 'No'),
        };

        if(prescriptionString) post_data.internalNotes = prescriptionString;

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
                // && order.paymentState == "Paid"
                if(prescriptionString && order.paymentState == "Paid") holdOrder(body.orderId)
                callback(null, body);
            }
        })
    })
};

var holdOrder = function(orderId, callback){
    var header = getHeader(),
        date = new Date();

    date.setYear(date.getFullYear()+5);

    var call_options = {
        url: 'https://'+domain+'/orders/holduntil',
        method: "POST",
        json: true,
        body: {
            orderId: orderId,
            holdUntilDate: date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate()
        },
        headers: {
            "content-type": "application/json",
            'Authorization': header,
        },
    }

    request(call_options, function (error, response, body) {
        if(error){
            console.log(error)
            if(typeof callback === 'function')
                callback(error);
        }else{
            if(typeof callback === 'function')
                callback(null, body)
        }
    })
};

var buildName = function(address){
    var fullname = ""

    if(address.salutation)
        fullname += address.salutation + " "

    fullname += address.firstName + " " + address.lastName;

    return fullname
}

var buildItems = function(order){
    var shipItems = [],
        customLinesInReceipt = [config.highIndex.slug]
    order.lineItems.forEach(function(item){
        shipItems.push({
            lineItemKey: item.id,
            sku: item.variant.sku,
            name: item.name.en,
            imageUrl: (item.variant.images.length > 0 ? item.variant.images[0].url : null),
            quantity: item.quantity,
            unitPrice: item.price.value.centAmount/100,
            //productId: item.productId,
        })
    });

    // Adds high-index lines
    order.customLineItems.forEach(function(item){
        if(customLinesInReceipt.indexOf(item.slug) >= 0){
            shipItems.push({
                lineItemKey: item.id,
                sku: item.slug,
                name: item.name.en,
                quantity: item.quantity,
                unitPrice: item.money.centAmount/100,
            })
        }
    })

    return shipItems;
};

var hasHighIndex = function(order){
    if(order.customLineItems && typeof order.customLineItems === 'object'){
        for(var i in order.customLineItems){
            var line = order.customLineItems[i]
            if(line.slug == config.highIndex.slug && line.quantity > 0){
                return true
            }
        }
    }
    return false
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var prescriptionToString = function(orderId, email){
    var str = '';
    return new Promise(function(resolve, reject){
        PrescriptionService.byId(orderId, function(err, result){
            if(!err && result){
                var val = result.value;

                str += "Type: "+ val.type.capitalize() + ",\n"
                if(val.type == 'reader'){
                    str += "Strength: +"+ val.data.strength
                }else{
                    if(val.method == 'calldoctor'){
                        str += "Method: " + "Call Doctor" + ",\n";
                        str += "Doctor Name: "+ val.data.doctorName+",\n";
                        str += "Clinic State: "+ val.data.state+",\n";
                        str += "Phone Number: "+ val.data.phoneNumber+",\n";
                        str += "Patient Name: "+ val.data.patientName+",\n";
                        str += "Patient Birth: "+ val.data.partientBirth;
                    }else if(val.method == 'sendlater'){
                        str += "Method: " + "Send Later" + ",\n";
                        str += "Customer Email: " + (email ? email : "Not provided");
                    }else if(val.method == 'upload'){
                        str += "Method: " + "Upload File" + ",\n";
                        str += "File name: " + val.data.new_filename;
                    }
                }
                resolve(str)
            }else{
                resolve(null)
            }
        });
    });
};
