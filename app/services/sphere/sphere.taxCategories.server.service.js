'use strict';

var Promise = require('promise'),
    SphereClient = require('../../clients/sphere.server.client.js');

var firstTax = {};
var taxById = {};
var taxByKey = {};
var lastFetchTime;

module.exports = function (app) {
    var CommonService = require('./sphere.commons.server.service.js') (app);
    var service = {};

    service.getByKey = function(key){
        if(taxByKey.hasOwnProperty(key) && stillValidData()){
            return taxByKey[key]
        }else{
            fetchTaxCategories().then(function(){
                if(taxByKey.hasOwnProperty(key)){
                    return taxByKey[key]
                }else{
                    return null
                }
            })
        }
    };

    service.getById = function(id){
        if(taxById.hasOwnProperty(id) && stillValidData()){
            return taxById[id];
        }else{
            fetchTaxCategories().then(function(){
                if(taxById.hasOwnProperty(id)){
                    return taxById[id];
                }else{
                    return null;
                }
            })
        }
    };

    service.getFirst = function(){
        if(firstTax && stillValidData()){
            return firstTax;
        }else{
            fetchTaxCategories().then(function(){
                if(firstTax){
                    return firstTax;
                }else{
                    return null;
                }
            })
        }
    }

    var stillValidData = function(){
        var maxHoursDifference = 24;
        return ((new Date - lastFetchTime)/(1000*60*60) < maxHoursDifference);
    };

    var fetchTaxCategories = function(){
        var p = new Promise(function(resolve, reject){
            SphereClient.getClient().taxCategories.all().fetch().then(function(results){
                var taxCategories = results.body.results;

                firstTax = taxCategories[0]
                for(var i = 0; i < taxCategories.length; i++){
                    var taxCategory = taxCategories[i];
                    delete taxCategory.createdAt;
                    delete taxCategory.lastModifiedAt;

                    taxById[taxCategory.id] = taxCategory;
                    taxByKey[taxCategory.key] = taxCategory;
                }

                lastFetchTime = new Date();

                resolve()
            }).error(function (err) {
                app.logger.error("Error fetching tax categories. Error: %s",JSON.stringify(err));
                reject(err);
            })
        });

        return p
    };

// Run once on startup
    app.logger.debug("Initializing Sphere Tax Categories");
    fetchTaxCategories();
    return service;
}

