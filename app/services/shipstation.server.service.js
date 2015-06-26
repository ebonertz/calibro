'use strict';

var domain = 'ssapi.shipstation.com',
    config = require("../../config/config.js"),
    https = require('https'),
    querystring = require('querystring');

var header;
exports.ship = function(callback){
    try {
        header = "Basic "+new Buffer(config.shipstation.key+":"+config.shipstation.secret, 'utf8').toString('base64');
        //callback(null, new Buffer('cbd2a0614cbc48f7aed5f017a4551fd5:e784026082e24169b2581c9bc503d6ec', 'utf8').toString('base64'))

        //console.log(header)

        var post_data =  JSON.stringify({
            orderNumber: "1234",
            orderDate: "2015/03/03",
            orderStatus: "awaiting_shipment",
            billTo: {
                name: "Someones name",
                street1: "The streeeet",
                street2: "1232",
                street3: "3",
                city: "New York",
                state: "NY",
                postalCode: "21234",
                country: "US",
            },
            shipTo: {
                name: "Someones name",
                company: "company",
                street1: "The streeeet",
                street2: "1232",
                street3: "3",
                city: "New York",
                state: "NY",
                postalCode: "21234",
                country: "US",
                phone: "123123123",
                residential: true
            }
        })

        //var post_data = JSON.stringify({
        //    "orderNumber": "ABC123",
        //    "orderKey": "0f6aec18-3e89-4771-83aa-f392d84f4c74",
        //    "orderDate": "2014-03-31T17:46:27.0000000",
        //    "paymentDate": "2014-03-31T17:46:27.0000000",
        //    "orderStatus": "shipped",
        //    "customerUsername": "headhoncho@whitehouse.gov",
        //    "customerEmail": "headhoncho@whitehouse.gov",
        //    "billTo": {
        //        "name": "The President",
        //        "company": null,
        //        "street1": null,
        //        "street2": null,
        //        "street3": null,
        //        "city": null,
        //        "state": null,
        //        "postalCode": null,
        //        "country": null,
        //        "phone": null,
        //        "residential": null
        //    },
        //    "shipTo": {
        //        "name": "The President",
        //        "company": "US Govt",
        //        "street1": "1600 Pennsylvania Ave",
        //        "street2": "Oval Office",
        //        "street3": null,
        //        "city": "Washington",
        //        "state": "DC",
        //        "postalCode": "20500",
        //        "country": "US",
        //        "phone": null,
        //        "residential": true
        //    },
        //    "items": [
        //        {
        //            "lineItemKey": null,
        //            "sku": "ABC123",
        //            "name": "Test item #1",
        //            "imageUrl": null,
        //            "weight": {
        //                "value": 24,
        //                "units": "ounces"
        //            },
        //            "quantity": 2,
        //            "unitPrice": 99.99,
        //            "warehouseLocation": "Aisle 1, Bin 7",
        //            "options": [],
        //            "adjustment": false
        //        },
        //        {
        //            "lineItemKey": null,
        //            "sku": "DEF456",
        //            "name": "Test item #2",
        //            "imageUrl": null,
        //            "weight": {
        //                "value": 0.01,
        //                "units": "ounces"
        //            },
        //            "quantity": 3,
        //            "unitPrice": 1.25,
        //            "warehouseLocation": "Aisle 7, Bin 34",
        //            "options": [],
        //            "adjustment": false
        //        }
        //    ],
        //    "amountPaid": 218.73,
        //    "taxAmount": 5,
        //    "shippingAmount": 10,
        //    "customerNotes": null,
        //    "internalNotes": "This order was created via the ShipStation API",
        //    "gift": false,
        //    "giftMessage": null,
        //    "paymentMethod": null,
        //    "requestedShippingService": "Priority Mail",
        //    "carrierCode": "fedex",
        //    "serviceCode": "fedex_2day",
        //    "packageCode": "package",
        //    "confirmation": "delivery",
        //    "shipDate": "2014-04-08",
        //    "weight": {
        //        "value": 0,
        //        "units": "ounces"
        //    },
        //    "dimensions": {
        //        "units": "inches",
        //        "length": 7,
        //        "width": 5,
        //        "height": 6
        //    },
        //    "insuranceOptions": {
        //        "provider": null,
        //        "insureShipment": false,
        //        "insuredValue": 0
        //    },
        //    "internationalOptions": {
        //        "contents": null,
        //        "customsItems": null
        //    },
        //    "advancedOptions": {
        //        "warehouseId": 1612,
        //        "nonMachinable": false,
        //        "saturdayDelivery": false,
        //        "containsAlcohol": false,
        //        "storeId": 28155,
        //        "customField1": "Some custom data",
        //        "customField2": null,
        //        "customField3": null,
        //        "source": null
        //    }
        //})

        var call_options = {
            host: domain,
            path: "/orders/createorder",
            headers: {
                "Authorization": header,
                'Content-Type': 'application/json',
                'Content-Length': post_data.length
            },
            method: "POST",
            //body: post_data
        }


        var post_req = https.request(call_options, function(response) {
            // Continuously update stream with data
            response.setEncoding('utf8');
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                callback(null, JSON.parse(body));
            });
        });
        post_req.write(post_data);
        post_req.end();
    }catch(e){
        console.log(e)
        callback(e)
    }
}
