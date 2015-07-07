'use strict';

var CommonService = require('./sphere.commons.server.service.js'),
    Promise = require('promise'),
    SphereClient = require('../../clients/sphere.server.client.js');

var categories = [];
var chanById = {};
var chanByKey = {};

exports.getByKey = function(key){
    if(chanByKey.hasOwnProperty(key)){
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
    if(chanById.hasOwnProperty(id)){
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


var fetchChannels = function(){
    var p = new Promise(function(resolve, reject){
        SphereClient.getClient().channels.all().fetch().then(function(results){
            var channels = results.body.results;

            for(var i = 0; i < channels.length; i++){
                var chan = channels[i];
                chanById[chan.id] = chan;
                chanByKey[chan.key] = chan;
            }

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
