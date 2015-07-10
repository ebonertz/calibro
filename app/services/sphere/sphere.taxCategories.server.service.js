'use strict';

var CommonService = require('./sphere.commons.server.service.js'),
    Promise = require('promise'),
    SphereClient = require('../../clients/sphere.server.client.js');

var firstTax = {};
var taxById = {};
var taxByKey = {};
var lastFetchTime;

exports.getByKey = function(key){
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

exports.getById = function(id){
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

exports.getFirst = function(){
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
            console.log(err);
            reject(err);
        })
    });

    return p
};

// Run once on startup
console.log("Initializing Sphere Tax Categories");
fetchTaxCategories();
