'use strict';


var init = require('../config/init')(),
    config = require('../config/config'),
    SphereClient = require('../app/clients/sphere.server.client.js'),
    MandrillService = require('../app/services/mandrill.server.service.js'),
    csv = require('fast-csv'),
    fs = require('fs'),
    path = require('path');

var integration_names = ['quickbook','shipstation'],
    intgs = {},
    days_to_fetch = 2;

// Functions
var buildFiles = function(intgs){
    var date = new Date()
    date.setDate(date.getDate() - days_to_fetch);

    SphereClient.getClient().orders.where('createdAt > "'+date.toJSON()+'"').fetch().then(function(res){
        var results = res.body.results;

        if(results.length == 0){
            console.log("No orders to export")
            return
        }else{
            console.log("Got "+results.length+" orders.")
        }

        results.forEach(function(value, key){

            var order = {
                payed: value.orderState == "Completed",
                totalPrice: value.totalPrice.centAmount/100,
                grossPrice: value.taxedPrice.totalGross.centAmount/100,
                shippingPrice: value.shippingInfo ? value.shippingInfo.shippingRate.price.centAmount/100 : 0,
                taxPrice: value.taxedPrice.taxPortions[0].amount.centAmount/100,
                streetName: value.shippingAddress ? value.shippingAddress.streetName : "",
                streetNumber: value.shippingAddress ?  value.shippingAddress.streetNumber : "",
                address: value.shippingAddress ? value.shippingAddress.streetName + " " + value.shippingAddress.streetNumber : null
            }

            var createdAt = new Date(value.createdAt);
            var createdAtDateStr = createdAt.getMonth() + '/' + createdAt.getDate() + '/' + createdAt.getFullYear();

            intgs['quickbook'].csvStream.write({
                "DATE": createdAtDateStr,
                "DESCRIPTION": 'SPHERE.IO - ID: '+value.id,
                "Amount": order.totalPrice
            })

            value.lineItems.forEach(function(item){
                intgs['shipstation'].csvStream.write({
                    "Order Number": value.id,
                    "Order Create Date": createdAtDateStr,
                    "Order Date Paid": "",
                    "Order Total": order.grossPrice,
                    "Order Amount Paid": order.grossPrice,
                    "Order Tax Paid": order.taxPrice,
                    "Order Shipping Paid":order.shippingPrice,
                    "Order Shipping Service": value.shippingInfo ? value.shippingInfo.shippingMethodName : null,
                    "Order Total Weight (oz)": null,
                    "Order Custom Field 1": null,
                    "Order Custom Field 2": null,
                    "Order Custom Field 3": null,
                    "Order Source": "Sphere.io",
                    "Order Notes to Buyer": null,
                    "Order Notes from Buyer": null,
                    "Order Internal Notes": null,
                    "Ship to First Name": value.shippingAddress.firstName,
                    "Ship to Last Name": value.shippingAddress.lastName,
                    "Ship to Phone": value.shippingAddress.phone,
                    "Ship to E-mail": null,
                    "Ship to Username": null,
                    "Ship to Company Name": null,
                    "Ship to Address":  value.shippingAddress.streetName,
                    "Ship to Address 2": value.shippingAddress.streetNumber,
                    "Ship to Address 3": null,
                    "Ship to City": value.shippingAddress.city,
                    "Ship to Postal Code": value.shippingAddress.postalCode,
                    "Ship to Country Code": value.shippingAddress.country,
                    "Product Height (in)": null,
                    "Product Width (in)": null,
                    "Product Length (in)": null,
                    "Product Sku": item.variant.sku,
                    "Product Name": item.name.en,
                    "Product Quantity": item.quantity,
                    "Product Unit Price": item.price.value.centAmount/100,
                    "Product Weight (oz)": null,
                    "Product Options": null,
                    "Product Warehouse Location": null,
                    "Product Marketplace Item #": null
                })
            })

        })

        for(var name in intgs){
            intgs[name].csvStream.end()
        }
    })
}
var sendEmail = function(intg){
    fs.readFile(intg.file, 'utf8', function(err, data){
        if(err) {
            // Send error email
            console.log(err)
            return
        }

        data = new Buffer(data, 'utf8').toString('base64');

        // Add subject with integration name
        MandrillService.sendAttachment('focali.dev@gmail.com', 'Orders export for '+intg.name ,'sphere-orders-'+intg.name+'.csv', data , 'text/csv').then(function(res){
            console.log('Email sent for '+intg.name)
        }, function(error){
            console.log('Error sending email for '+intg.name)
            console.log(error)
        })
    });
}

/*
 * Execution
 */

integration_names.forEach(function(name){
    var file_path = path.join(__dirname, name+'.csv');

    intgs[name] = {
        name: name,
        file: file_path,
        csvStream: csv.createWriteStream({headers: true}),
        writableStream: fs.createWriteStream(file_path)
    }

    intgs[name].writableStream.on("finish", function(){
        console.log(name+" stream writing done.");
        sendEmail(intgs[name])
    });

    intgs[name].csvStream.pipe(intgs[name].writableStream);
})

// Write csv from info fetch from Sphere
buildFiles(intgs);