process.env["NODE_ENV"] = "development";


var SphereClient = require('../app/clients/sphere.server.client.js')
var cartClient = SphereClient.getClient().carts;
var _ = require ('lodash');

cartClient.where('cartState = "Active" and taxMode ="Platform"').all().fetch().then(function (carts) {
    _.each (carts.body.results, function (cart) {
        cartClient.byId(cart.id).delete(cart.version).then (function (result) {
            console.log ("Cart "+cart.id+ " deleted. "+ JSON.stringify(result));
        });
    });
});
