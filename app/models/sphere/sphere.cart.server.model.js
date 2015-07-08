"use strict";

var ChannelService = require('../../services/sphere/sphere.channels.server.service.js');

var Cart = function(opt) {
    for(var key in opt){
        this[key] = opt[key]
    }

    for(var i in this.lineItems){
        var distChan = this.lineItems[i].distributionChannel
        if(distChan)
            this.lineItems[i].distributionChannel = ChannelService.getById(distChan.id)
    }
}

module.exports = Cart;
