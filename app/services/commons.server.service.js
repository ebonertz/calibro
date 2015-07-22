var https = require("https"),
    config = require('../../config/config');

var merchantCode = 'COMMERCETOOLS',
    sanboxToken = 'gcgc91ghu6jnosk6aeve9fgv660dsolc6oglmb9s';

/* Example:
 var headers = {
 'Content-Type': "application/json"
 };

 // Build config object for https.request
 var endpoint = {
 "host": "www.googleapis.com",
 "port": 443,
 "path": "/oauth2/v3/token?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&refresh_token=" + refresh_token + "&grant_type=refresh_token",
 "method": "POST",
 "headers": headers
 };
 */
exports.doRequest = function (endpoint, callback) {

    var post_req = https.request(endpoint, function (res) {
        var body = '';

        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            var parsed = null;

            try {
                parsed = JSON.parse(body);
            }
            catch (err) {
                callback(err, null);
                return;
            }

            callback(null, parsed);
        });
    });

    post_req.end();

    post_req.on('error', function (e) {
        console.error(e);
        callback(e, null);
        return;
    });
}

exports.doRequestNoParse = function (endpoint, callback) {

    var post_req = https.request(endpoint, function (res) {
        var body = '';

        res.on('data', function (d) {
            body += d;
        });

        res.on('end', function () {
            callback(null, body);
        });
    });

    post_req.end();

    post_req.on('error', function (e) {
        console.error(e);
        callback(e, null);
        return;
    });
}


exports.parseKeyValuePairs = function (str, divider) {
    var lines = str.split(divider);
    var map = {};
    for (var i = 0; i < lines.length; i++) {
        var pieces = lines[i].split("=");
        if (pieces.length == 2)
            map[pieces[0]] = pieces[1];
    }
    return map;
}
