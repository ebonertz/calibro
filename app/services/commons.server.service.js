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
            catch(err) {
                callback(err, null);
            }

            callback(null, parsed);
        });
    });

    post_req.end();

    post_req.on('error', function (e) {
        console.error(e);
        callback(e, null);
    });
}
