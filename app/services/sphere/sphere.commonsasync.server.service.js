var SphereClient = require('../../clients/sphere.server.client.js'),
    Commons = require('../commons.server.service.js'),
    config = require('../../../config/config'),
    Promise = require('bluebird');


module.exports = function (app) {
    var service = {};
    var entity = this.entity;

    service.list = function (entity, callback) {
    };

    service.where = function (entity, query, callback) {
    };

    service.all = function (entity, callback) {
    }


    service.create = function (entity, object, callback) {
    };

    service.delete = function (entity, id, callback) {
    };

    service.deleteAll = function (entity, callback) {
    };


    service.byId = function (id, expand) {
      var q = SphereClient.getClient()[entity];

      if (expand) q = q.expand(expand);

      return q.byId(id).fetch().then(function (res) {
        return res.body;
      });
    };

    service.bySlug = function (slug) {
      return SphereClient.getClient()[entity].where('slug(en = "' + slug + '")').fetch().then(function (res) {
        var results = res.body.results;

        if (results.length === 0){
          throw new SphereClient.SphereHttpError.NotFound(entity + " with slug " + slug + " not found");
        }
        return results[0];
      })
    }

    service.byCustomer = function (customerId) {
      return SphereClient.getClient()[entity].where('customerId="' + customerId + '"').all().fetch().then(function (result) {
        return result.body.results;
      })
    };

    service.byName = function (name) {
      return SphereClient.getClient()[entity].where('name="' + name + '"').fetch().then(function (result) {
        return result.body.results;
      })
    };

    service.update = function (id, actions) {
      return SphereClient.getClient()[entity].byId(id).fetch().then(function (result) {
        SphereClient.getClient()[entity].byId(id).update({
            version: result.body.version,
            actions: actions
        }).then(function (result) {
          return result.body;
        });
      });
    };

    service.updateWithVersion = function (id, version, actions) {
      return SphereClient.getClient()[entity].byId(id).update({
        version: version,
        actions: actions
      }).then(function (result) {
        return result.body
      });
    };

    return service;
}
