var SphereClient = require('../../clients/sphere.server.client.js'),
    Commons = require('../commons.server.service.js'),
    config = require('../../../config/config'),
    Promise = require('bluebird');


module.exports = function (app) {
    var service = {};
    var entity = this.entity;

    service.getSphereClient = function() {
      return SphereClient.getClient()[entity]
    }

    service.list = function (entity, callback) {
    };


    service.where = function (opts, expand) {
      var q = SphereClient.getClient()[entity]

      if (typeof opts === 'object') {
        // Call all opts
        _.forEach(opts, function(value, key) {
          if (_.has(q, key)) {
            q[key].apply(null, value)
          }
        })
      } else {
        // Regular where
        q.where(opts).all()
      }

      if (expand) q.expand(expand)

      return q.fetch()
        .then(function(res) {
          return res.body.results;
        })
    };

    service.all = function () {
      return SphereClient.getClient()[entity].all().fetch()
      .then(function(res) {
        return res.body.results;
      });
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

    service.findOne = function (query, expand) {
      var q = service.getSphereClient().where(query);

      if (expand) q = q.expand(expand);

      return q.fetch().then(function (result) {
        if (result.body.results.length > 0) {
          return result.body.results[0];
        } else {
          throw new SphereClient.SphereHttpErrors.NotFound();
        }
      })
    };

    service.update = function (id, actions, expand) {
      return service.byId(id)
      .then(function(obj) {
        return service.updateWithVersion(id, obj.version, actions, expand)
      })
    };

    service.updateWithVersion = function (id, version, actions, expand) {
      var q = service.getSphereClient().byId(id);

      if (expand) q = q.expand(expand);

      return q.update({
        version: version,
        actions: actions
      }).then(function (result) {
        return result.body
      });
    };

    return service;
}
