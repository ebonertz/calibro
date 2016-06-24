'use strict';
process.env["NODE_ENV"] = "development";
var client = require('../app/clients/sphere.server.client.js').getClient();
var _ = require ('lodash');
var Promise = require('bluebird');

client.products.all().fetch().then (function (products) {
    Promise.each (products.body.results, function (product) {
        var variants = product.masterData.current.variants;
        variants.push (product.masterData.current.masterVariant);
       Promise.each (variants,function (variant) {
            return removeImages (product,variant.id,variant.images)
        });
    });
});


var removeImages = function (product,variantId,images) {
    var found = _.find(images, function (item) {
        return item.url === "undefined";
    })
    var actions = [];
    if (found) {
       actions.push({
            "action": "removeImage",
            "variantId": variantId,
            "imageUrl": "undefined",
            "staged": false
        })
        return client.products.byId(product.id).fetch().then (function(productRetrieved) {
            return client.products.byId(product.id).update({
                version: productRetrieved.body.version,
                actions: actions
            }).then(function (result) {
                console.log("Removed image from product "+product.id+", variant "+ variantId);
                return result;
            });
        });

}
    else {
        console.log("NOTHING TO REMOVE FROM product "+ product.id +" variant "+ variantId);

        return Promise.resolve();
    }
}
