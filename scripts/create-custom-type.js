'use strict';
process.env["NODE_ENV"] = "development";
var client = require('../app/clients/sphere.server.client.js').getClient();
var _ = require('lodash');



client.types.create({
  key: "customerCustomType",
  name: {
    en: "customerCustomType"
  },
  description: {
    en: "Custom type for customer"
  },
  resourceTypeIds: ["customer"]
}).then(function (res) {
  if (res.statusCode === 200 || res.statusCode === 201) {
   console.log("Customer custom type created successfully");
  } else {
    console.log("Error creating customer custom type. Error: %s"+ res.body);
  }
}).catch(function (err) {
  console.log("Error creating customer custom type. Error: %s"+ err);
});
