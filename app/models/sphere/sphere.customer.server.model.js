"use strict";

// var CustomerService = require('../../services/sphere/sphere.customers.server.service.js'),
// var schema = require('js-schema');

// var CustomerSchema = schema({
//   id: String,
//   email: /.+@.+\..+/,
//   firstName: String,
//   lastName: String,
//   '?createdAt': [null, String],
//   '?lastModifiedAt': [null, String],
//   '?type': [null, String],
//   '?version': [null, String],
//   '?addresses': [null, String],
// });

var Customer = function(opt){
  this.id = opt.id
  this.email = opt.email
  this.firstName = opt.firstName
  this.lastName = opt.lastName
  this.createdAt = opt.createdAt
  this.lastModifiedAt = opt.lastModifiedAt
  this.type = opt.type
  this.version = opt.version
  this.addresses = opt.addresses
}

// Customer.prototype.findById = function(id, callback) {
//   CustomerService.findOne(id, function(err, result){
//     if(result && result.password){
//       delete result.password 
//     }
//     callback(err, result)
//   });
// };

// Customer.prototype.validate = function(){
//   return CustomerSchema(this)
// }

module.exports = Customer

// var c = new Customer({email: "testtest.com"});
// console.log(c.email)
// c.validate()

// exports.getCustomer = function(){
//   return Customer
// };



// TODO: list
// TODO: send class
// TODO: helpers