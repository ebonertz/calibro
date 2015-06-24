var CryptoJS = require("crypto-js"),
    config = require('../../config/config'),
    CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    CommonService = require('./sphere/sphere.commons.server.service.js');

var apiLoginID = '78qH88Btv',
    transactionKey = '85k34Y4947T4pMkf';

exports.get = function (amount, callback) {

    CustomObjectService.find('globalInfo', 'lastPaymentNumber', function (err, customObject) {
        var lastPaymentNumber = 1;

        var newCustomObject = {
            container: 'globalInfo',
            key: 'lastPaymentNumber',
            value: lastPaymentNumber
        };

        if (customObject == null) {
            CommonService.create('customObjects', newCustomObject);
        } else {

            customObject.value++;
            lastPaymentNumber = customObject.value;

            CommonService.create('customObjects', customObject);

        }

        var now = new Date(),
            now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()),
            timeCorrection = config.authorizenet.timeCorrection;

        var time = (now_utc.getTime() / 1000);
        console.log("time: " + time);

        var timestamp = time - timeCorrection;

        var message = apiLoginID + '^' + lastPaymentNumber + '^' + timestamp + '^' + amount + '^';

        var hash = CryptoJS.HmacMD5(message, transactionKey).toString();

        console.log("apiLoginID: " + apiLoginID);
        console.log("transactionKey: " + transactionKey);
        console.log("lastPaymentNumber: " + lastPaymentNumber);
        console.log("timestamp: " + timestamp);
        console.log("hash: " + hash);

        var returnObj = {
            x_fp_sequence: lastPaymentNumber,
            x_fp_timestamp: timestamp,
            x_amount: amount,
            x_login: apiLoginID,
            x_tran_key: transactionKey,
            x_fp_hash: hash
        }

        callback(null, returnObj)

    });
}
