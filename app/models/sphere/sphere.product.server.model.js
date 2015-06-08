"use strict";

var Product = function(options){

  // Product data
  this.id = options.id;

  // TODO: Consider not sending dates from server OR fixing them
  this.createdAt = new Date(options.createdAt);
  this.lastModifiedAt = new Date(options.lastModifiedAt);

  this.name = options.name;
  this.description = options.description;
  this.categories = options.categories;

  if(options.displayVariant)
    this.displayVariant = options.displayVariant

  // Variants
  this.variants = []
  for(var i = 0; i < options.variants.length; i++){
      this.variants.push(new Variant(options.variants[i]))
  }

  this.masterVariant = new Variant(options.masterVariant)
}

var Variant = function(options){
  this.availability = options.availability;
  this.images = options.images;

  this.attr = {}
  for(var i = 0; i < options.attributes.length; i++){
    var opt = options.attributes[i]
    this.attr[opt.name] = opt.value;
  }

  this.prices = {}
  for(var i = 0; i < options.prices.length; i++){
    var price = options.prices[i]
    var name = (price.country ? price.value.currencyCode+'-'+price.country : price.value.currencyCode);
    this.prices[name] = price.value;
  }

  return this;
}

module.exports.Variant = Variant
module.exports.Product = Product