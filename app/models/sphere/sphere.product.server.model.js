"use strict";

var _ = require('lodash');

var lang = 'en';
var eyewearSlug = 'eyeglass';

module.exports = function (app) {
  var CategoriesService = require('../../services/sphere/sphere.categories.server.service')(app),
      ChannelsService = require('../../services/sphere/sphere.channels.server.service')(app);

  var model = {};
  model.Product = function(options){

    // Product data
    this.id = options.id;

    // TODO: Consider not sending dates from server OR fixing them
    this.createdAt = new Date(options.createdAt);
    this.lastModifiedAt = new Date(options.lastModifiedAt);

    this.name = options.name;
    this.description = options.description;
    this.slug = options.slug

    this.categories = options.categories
    this.isEyeglass = !!_.find(this.categories, ['slug.en', eyewearSlug])

    if(options.displayVariant)
      this.displayVariant = options.displayVariant

    // Variants
    this.variants = []
    for(var i = 0; i < options.variants.length; i++){
      this.variants.push(new model.Variant(options.variants[i]))
    }
    this.masterVariant = new model.Variant(options.masterVariant)
  };

  model.Variant = function(options){
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

    this.prices = []
    for(var i = 0; i < options.prices.length; i++){
      var price = options.prices[i];

      // Ignore price if it has no channel
      if(price.channel) {
        var channel = ChannelsService.byId(price.channel.id);
        price.channel = channel;
        this.prices.push(price);
      }
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
  };

  return model;
}
