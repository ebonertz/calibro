"use strict";

var _ = require('lodash'),
  Promise = require('bluebird');

var prescriptionChannels = ['singlevision'];

module.exports = function (app) {
    var ChannelService = require('../../services/sphere/sphere.channels.server.service.js')(app),
        CommonService = require('../../services/sphere/sphere.commons.server.service.js')(app),
        TaxCategoryService = require('../../services/sphere/sphere.taxCategories.server.service.js')(app);

    var Cart = function(opt) {
        var self = this
        for(var key in opt){
            this[key] = opt[key]
        }

        this.getPrescriptionCount = function(){
            this.prescriptionCount = 0;
            for(var i in this.lineItems) {
                var distChan = this.lineItems[i].distributionChannel
                if (distChan && prescriptionChannels.indexOf(distChan.key) >= 0)
                    this.prescriptionCount += this.lineItems[i].quantity
            }
            return this.prescriptionCount;
        };

        this.firstTaxCategory = function(){
          return TaxCategoryService.getFirst();
        }
    };

    return Cart;
}
