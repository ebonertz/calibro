"use strict";

var CategoriesService = require('../../services/sphere/sphere.categories.server.service');

var lang = 'en';

var Product = function(options){

  // Product data
  this.id = options.id;

  // TODO: Consider not sending dates from server OR fixing them
  this.createdAt = new Date(options.createdAt);
  this.lastModifiedAt = new Date(options.lastModifiedAt);

  this.name = options.name;
  this.description = options.description;
  this.slug = options.slug[lang]

  // Add slug to categories
  this.categories = options.categories
  for(var i = 0; i < this.categories.length; i++){
    var slug = CategoriesService.getSlug(this.categories[i].id)
    this.categories[i].slug = slug;
  }
  

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
  this.id = options.id;
  this.availability = options.availability;
  this.images = options.images;

  this.attr = {}
  for(var i = 0; i < options.attributes.length; i++){
    var opt = options.attributes[i]

    if(opt.name != "basePrices"){ // BasePrices will be added to the variant's root
      this.attr[opt.name] = opt.value;
    }else{
      options.basePrices = opt.value;
    }
  }

  this.prices = {}
  for(var i = 0; i < options.prices.length; i++){
    var price = options.prices[i]
    var name = (price.country ? price.value.currencyCode+'-'+price.country : price.value.currencyCode);
    this.prices[name] = price.value;
  }

  // BasePrices has been moved to root above
  if(options.basePrices){
    this.basePrices = {}
    for(var i = 0; i < options.basePrices.length; i++){
      var basePrice = options.basePrices[i]
      var name = (basePrice.country ? basePrice.currencyCode+'-'+basePrice.country : basePrice.currencyCode);
      this.basePrices[name] = basePrice;
    }
  }

  return this;
}

module.exports.Variant = Variant
module.exports.Product = Product