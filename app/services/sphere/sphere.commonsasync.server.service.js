'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
    _ = require('lodash'),
    Promise = require('bluebird');

module.exports = function () {
    var service = {};
    var entity = this.entity;

    service.getSphereClient = function() {
      if (!entity) {
        return Promise.reject('No entity defined');
      }

      return SphereClient.getClient()[entity];
    };

    service._query = function (opts, expand) {
      var q;

      try {
        q = service.getSphereClient();

        if (typeof opts === 'object') {
          // Call all opts
          _.forEach(opts, function(value, key) {
            if (typeof q[key] === 'function') {
              if (!_.isArray(value)) {
                // Needed to have correct argument-type
                value = [value];
              }
              q[key].apply(q, value);
            } else {
              throw new Error('Method ' + key + ' not recognized');
            }
          });
        } else {
          // Regular where
          q.where(opts).all();
        }

        if (expand) q.expand(expand);
        return q.fetch();

      } catch (err) {
        q._setDefaults();
        throw err;
      }
    };

    service.where = function (opts, expand) {
      return service._query(opts, expand)
        .then(function(res) {
          return res.body.results;
        });
    };

    service.all = function () {
      return service.getSphereClient().all().fetch()
      .then(function(res) {
        return res.body.results;
      });
    };

    /**
     * Builds and executes query to fetch one item
     * @param  {String/Object} query    if it's a string, it'll be assigned to
     *                                  the 'where' part of the query
     * @param  {String} expand          Optional expand query parameter
     * @return {[type]}        [description]
     */
    service.findOne = function (query, expand) {
      // Convert to object if not already one
      if (typeof query !== 'object') {
        query = {where: query};
      }
      query.perPage = 1;
      query.page = 1;

      return service._query(query, expand).then(function (result) {
        if (result.body.results.length > 0) {
          return result.body.results[0];
        } else {
          throw new SphereClient.SphereHttpErrors.NotFound();
        }
      });
    };

    service.byId = function (id, expand) {
      var q = service.getSphereClient();

      if (expand) q.expand(expand);

      return q.byId(id).fetch().then(function (res) {
        return res.body;
      });
    };

    service.bySlug = function (slug) {
      return service.findOne('slug(en = "' + slug + '")');
    };

    service.byCustomer = function (customerId, expand) {
      return service.where('customerId="' + customerId + '"', expand);
    };

    service.byName = function (name, expand) {
      return service.where('name="' + name + '"', expand);
    };

    service.update = function (id, actions, expand) {
      return service.byId(id)
      .then(function(obj) {
        return service.updateWithVersion(id, obj.version, actions, expand);
      });
    };

    service.updateWithVersion = function (id, version, actions, expand) {
      var q = service.getSphereClient().byId(id);

      if (expand) q.expand(expand);

      return q.update({
        version: version,
        actions: actions
      }).then(function (result) {
        return result.body;
      });
    };

    service.save = function (payload) {
      return service.getSphereClient().save(payload).then(function (result) {
        return result.body;
      });
    };

    service.login = function (payload) {
      return service.getSphereClient().login(payload).then(function (result) {
        return result.body;
      })
    }

    return service;
};
