"use strict";

var Address = function(opt){
  this.firstName = opt.firstName
  this.lastName = opt.lastName
  this.phone = opt.phone

  if(opt.company)
    this.company = opt.company

  this.streetName = opt.streetName
  if(opt.additionalStreetInfo) {
    this.additionalStreetInfo = opt.additionalStreetInfo
  }

  this.city = opt.city
  this.state = opt.state
  this.postalCode = opt.postalCode

  this.country = opt.country
}

module.exports = Address
