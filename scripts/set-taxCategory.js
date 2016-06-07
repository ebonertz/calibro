process.env["NODE_ENV"] = "development";


var SphereClient = require('../app/clients/sphere.server.client.js')
var taxCategoryClient = SphereClient.getClient().taxCategories;
var productClient = SphereClient.getClient().products;
taxCategoryClient.all().fetch().then(function (taxes) {
    var id = taxes.body.results[0].id;
    productClient.all().fetch().then(function (result) {
        var products = result.body.results;
        for (var i = 0; i < products.length; i++) {
            var action = {
                version: products [i].version,
                actions: [
                    {
                        action: 'setTaxCategory',
                        taxCategory: {
                            typeId: "tax-category",
                            id: id
                        }
                    }
                ]
            };
            productClient.byId(products [i].id).update(action).then (function (updated) {
                console.log (JSON.stringify(updated))
            });

        }

    })
})
