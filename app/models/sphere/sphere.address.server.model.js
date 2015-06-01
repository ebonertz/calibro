"use strict";

var Address = function(opt){
  this.firstName = opt.firstName,
  this.lastName = opt.lastName,
  this.phone = opt.phone,

  this.streetName = opt.streetName,
  this.streetNumber = opt.streetNumber.toString(),

  this.city = opt.city,
  this.state = opt.state,
  this.postalCode = opt.postalCode.toString(),

  this.country = opt.country
}

module.exports = Address