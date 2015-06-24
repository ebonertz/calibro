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

        var post_data = querystring.stringify({
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
                street1: "The streeeet",
                street2: "1232",
                street3: "3",
                city: "New York",
                state: "NY",
                postalCode: "21234",
                country: "US",
                phone: "123123123"
            }
        })

        var call_options = {
            host: domain,
            path: "/orders/createorder",
            headers: {
                "Authorization": header,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': post_data.length
            },
            method: "POST"
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
