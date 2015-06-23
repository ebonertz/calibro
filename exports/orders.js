'use strict';


var init = require('../config/init')(),
    config = require('../config/config'),
    SphereClient = require('../app/clients/sphere.server.client.js'),
    MandrillService = require('../app/services/mandrill.server.service.js'),
    csv = require('fast-csv'),
    fs = require('fs'),
    path = require('path');

var file = path.join(__dirname, 'my.csv'),
    csvStream = csv.createWriteStream({headers: true}),
    writableStream = fs.createWriteStream(file);

// Write csv from info fetch from Sphere
writableStream.on("finish", function(){
    console.log("DONE!");
});

csvStream.pipe(writableStream);

console.log("Fetching orders from Sphere")
var q = new Promise(function(done, reject){
    // Add fail case
    var date = new Date()
    date.setDate(date.getDate() - 1);
    //2015-06-18T13:03:42.488Z

    console.log('createdAt > '+date.toJSON())

    SphereClient.getClient().orders.where('createdAt > "'+date.toJSON()+'"').fetch().then(function(res){
        var results = res.body.results;

        if(results.length == 0){
            console.log("No orders to export")
            return
        }
        results.forEach(function(value, key){

            var date = new Date(value.createdAt);

            var product = {
                "DATE":  date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear(),
                "DESCRIPTION": 'SPHERE.IO - ID: '+value.id,
                "Amount": value.totalPrice.centAmount/100
            }
            csvStream.write(product)
        })
        csvStream.end()

        // Wait for csvStream to finish writing...
        setTimeout(function() { done() }, 2000);
    })
})
.then(function(){
    // Send email

    var file_contents = fs.readFile(file, 'utf8', function(err, data){
        if(err) {
            // Send error email
            console.log(err)
            return
        }

        data = new Buffer(data, 'utf8').toString('base64')
        MandrillService.sendAttachment('focali.dev@gmail.com', 'sphere-orders.csv', data , 'text/csv').then(function(res){
            console.log('Email sent')
        }, function(error){
            console.log('Error')
            console.log(error)
        })
    });
}, function(err){
    console.log(err)
})
