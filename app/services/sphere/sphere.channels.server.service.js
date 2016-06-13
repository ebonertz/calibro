'use strict';

var CommonService = require('./sphere.commons.server.service.js'),
    Promise = require('promise'),
    _ = require ('lodash'),
    SphereClient = require('../../clients/sphere.server.client.js');

var categories = [];
var chanById = {};
var chanByKey = {};
var channels = [];
var lastFetchTime;

exports.listChannels = function () {
 return channels;
}
exports.getByKey = function(key){
    // TODO: Block thread if channel not there (this is wrong)
    if(chanByKey.hasOwnProperty(key) && stillValidData()){
        return chanByKey[key]
    }else{
        fetchChannels().then(function(){
            if(chanByKey.hasOwnProperty(key)){
                return chanByKey[key]
            }else{
                return null
            }
        })
    }
};

exports.getById = function(id){
    if(chanById.hasOwnProperty(id) && stillValidData()){
        return chanById[id];
    }else{
        fetchChannels().then(function(){
            if(chanById.hasOwnProperty(id)){
                return chanById[id];
            }else{
                return null;
            }
        })
    }
};

var stillValidData = function(){
    var maxHoursDifference = 24;
    return ((new Date - lastFetchTime)/(1000*60*60) < maxHoursDifference);
};

var fetchChannels = function(){
    var p = new Promise(function(resolve, reject){
        SphereClient.getClient().channels.all().fetch().then(function(results){
            channels = results.body.results;

            for(var i = 0; i < channels.length; i++){
                var chan = channels[i];
                delete chan.createdAt;
                delete chan.lastModifiedAt;

                chanById[chan.id] = chan;
                chanByKey[chan.key] = chan;
            }

            lastFetchTime = new Date()

            resolve()
        }).error(function (err) {
            console.log(err);
            reject(err);
        })
    });

    return p
};

// Run once on startup
console.log("Initializing Sphere Channels");
fetchChannels();
