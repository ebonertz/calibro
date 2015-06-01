"use strict";

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

module.exports = Customer