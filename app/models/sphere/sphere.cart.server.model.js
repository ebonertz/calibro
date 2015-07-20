"use strict";

var ChannelService = require('../../services/sphere/sphere.channels.server.service.js'),
    CommonService = require('../../services/sphere/sphere.commons.server.service.js');

var prescriptionChannels = ['singlevision'];

var Cart = function(opt) {
    var self = this
    for(var key in opt){
        this[key] = opt[key]
    }

    for(var i in this.lineItems){
        var distChan = this.lineItems[i].distributionChannel
        if(distChan)
            this.lineItems[i].distributionChannel = ChannelService.getById(distChan.id);
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
        if(self.taxCategory){
            return self.taxCategory
        }else {
            getFirstTaxCategory().then(function (res) {
                self.taxCategory = res;
                return res;
            });
        }
    }

    this.getFirstTaxCategory = function(){
        return new Promise(function(resolve, reject){
            CommonService.all('taxCategories', function(err, res){
                if(err && res.length > 0){
                    reject(err)
                }else{
                    resolve(res[0])
                }
            })
        });
    }
};

module.exports = Cart;
