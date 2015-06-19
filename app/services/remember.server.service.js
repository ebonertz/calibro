'use strict';

var CryptoJS = require("crypto-js"),
    config = require("../../config/config.js");

exports.getCustomerHashes = function(id){
    var now = new Date(),
        now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()),
        timeCorrection = 10773;

    var timestamp = (now_utc.getTime() / 1000) - timeCorrection;

    var message = id + '^' + timestamp + '^' + Math.random().toString(),
        rememberToken = CryptoJS.HmacMD5(message, config.rememberMeKey).toString(),
        idHash = this.encodeId(id, rememberToken);

    return {
        rem: rememberToken,
        rid: idHash
    }
}

exports.getToken = function(id){
    var now = new Date(),
        now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()),
        timeCorrection = 10773;

    var timestamp = (now_utc.getTime() / 1000) - timeCorrection;

    var message = id + '^' + timestamp + '^' + Math.random().toString();

    return CryptoJS.HmacMD5(message, config.rememberMeKey).toString();
}

exports.encodeId = function(id, token){
    return CryptoJS.HmacMD5(token+'^'+id, config.rememberMeKey).toString();
}
