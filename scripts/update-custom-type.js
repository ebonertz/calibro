'use strict';
process.env["NODE_ENV"] = "development";
var client = require('../app/clients/sphere.server.client.js').getClient();



client.types.where('key="customerCustomType"').fetch().then(function (res) {
  if (res.body.results.length > 0) {
    return res.body.results[0];
  }
}).then(function (customerCustomType) {
  if (customerCustomType) {
    client.types.byId(customerCustomType.id).update({
      version: customerCustomType.version,
      actions: [{
        action: "addFieldDefinition",
        fieldDefinition: {
          "name": "braintreeId",
          "label": {
            "en": "Braintree customer id"
          },
          "required": false,
          "type": {
            "name": "Number"
          },
          "inputHint": "SingleLine"
        }
      }]
    }).then(function (res) {
      if (res.statusCode === 200 || res.statusCode === 201) {
        console.log("Customer custom type updated successfully");
      } else {
        console.log("Error updating customer custom type. Error: %s"+ res.body);
      }
    }).catch(function (err) {
      console.log("Error updating customer custom type. Error: %s"+ err);
    });
  } else {
    console.log("Customer custom type not found");
  }
});

