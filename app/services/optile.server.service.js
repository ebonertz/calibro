var https = require("https"),
    config = require('../../config/config');

var merchantCode = 'COMMERCETOOLS',
    sanboxToken = 'gcgc91ghu6jnosk6aeve9fgv660dsolc6oglmb9s';

exports.list = function (country, customer, payment, callback) {

    exports.listPost(country, customer, payment, function(err, data) {

        if(err) {
            callback(err, null);
        } else {
            if(data == null || data.links == null) {
                callback(new Error('Something wrong.'), null);
            } else {
                callback(null, data.links.self);
            }

        }

    });

}

exports.listPost = function (country, customer, payment, callback) {

    var payload = {
        "transactionId": "tr101156153",
        "country": country,
        "customer": customer,
        "payment": payment,
        "callback": {
            "returnUrl": config.serverPath + '/optile/return',
            "cancelUrl": config.serverPath + '/optile/cancel',
            "notificationUrl": config.serverPath + '/optile/notification'
        }
    };

    var req_data = JSON.stringify(payload);

    var headers = {
        'Authorization': 'Basic ' + new Buffer(merchantCode + '/' + sanboxToken + ':').toString('base64'),
        'Content-Type': 'application/vnd.optile.payment.enterprise-v1-extensible+json',
        'Accept': 'application/vnd.optile.payment.enterprise-v1-extensible+json'
    };

    var endpoint = {
        "host": "api.sandbox.oscato.com",
        "port": 443,
        "path": "/api/lists",
        "method": "POST",
        "headers": headers
    };

    var post_req = https.request(endpoint, function (res) {
        console.log("statusCode: ", res.statusCode);

        res.on('data', function (d) {
            callback(null, JSON.parse(d.toString()));
        });
    });

    post_req.write(req_data);
    post_req.end();

    post_req.on('error', function (e) {
        callback(e, null);
    });

}

