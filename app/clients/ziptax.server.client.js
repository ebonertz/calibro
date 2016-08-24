'use strict';

var ZipTax = require('ziptax'),
config = require('../../config/config');

var zt = new ZipTax(config.ziptax.apikey);

exports.getClient = function() {
    return zt;
}

