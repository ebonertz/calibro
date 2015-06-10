var https = require("https");

exports.list = function () {

    var payload = {transaction: {
        "transactionId": "tr101",
        "country": "DE",
        "integration": "HOSTED",
        "customer": {
            "number": "42",
            "email": "walter.smith@optile.de"
        },
        "payment": {
            "amount": 19.99,
            "currency": "EUR",
            "reference": "ubuy 101/20-03-2013"
        },
        "callback": {
            "returnUrl": "http://www.google.com",
            "cancelUrl": "http://www.google.com",
            "notificationUrl": "http://www.google.com"
        }
    }};

    var req_data = JSON.stringify(payload);

    var headers = {
        'Authorization': 'Basic VUJVWS9CQnRYYTd5dWJSOGlwdVQ=',
        'Content-Type': "application/json"
    };

    var endpoint = {
        "host": "api.live.oscato.com",
        "port": 443,
        "path": "/lists",
        "method": "POST",
        "headers": headers
    };

    var post_req = https.request(endpoint, function (res) {
        console.log("statusCode: ", res.statusCode);

        res.on('data', function (d) {
            console.log(d);
        });
    });

    post_req.write(req_data)
    post_req.end();

    post_req.on('error', function (e) {
        console.error(e);
    });

}

