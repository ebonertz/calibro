var ContentfulClient = require('../clients/contenful.server.client.js'),
    ProductService = require('../services/sphere/sphere.products.server.service.js'),
    config = require('../../config/config'),
    _ = require('lodash');

var NodeCache = require('node-cache');

var cache;
var service = {};

/**
 * Getters
 */

service.getCache = function() {
  if (!(cache instanceof NodeCache)) {
    ttl = config.contentful.cache.ttl
    cache = ttl ? new NodeCache({
      stdTTL: ttl,
    }) : new NodeCache();
  }
  return cache;
}

service.getClient = function() {
  return ContentfulClient.getClient();
}

/**
 * List
 */
service.list = function (callback) {
    ContenfulClient.getClient().entries({}, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, entries);
        }
    });
};

service.byId = function (id, callback) {
    ContenfulClient.getClient().entries({
        'sys.id': id
    }, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, entries);
        }
    });
};

service.home = function (callback) {
    var entityId = '3jUtHsj4y4QeGkWESIo0Qa';

    service.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

service.help = function (callback) {
    var entityId = '3wp9hYrKBikSOSsE80Y8KG';

    service.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

service.eyewear = function (gender,callback) {
    var entityId;
    if (gender == 'men') {
        entityId = "6jbTL9KhPOA8KA0sCQ4Y6I";
    }
   else if (gender == 'women'){
        entityId = '32Mzd4XlIkEYK4U2m2GOqM';
    }
    service.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });

};

service.sunglasses = function (gender,callback) {
    if (gender == 'men') {
        entityId = "4TSQucctC8AOKeUaUA8Qc8";
    }
    else if (gender == 'women'){
        entityId = '3ifY0yAVI4wuukGIU2OOkA';
    }
    service.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

service.menSummer = function (callback) {
    var entityId = '1RSBBWPySY08Wc2ScOWMwI';

    summer(entityId, function(err, data) {
        if(err)
            callback(err, null);
        else
            callback(null, data);
    })
};

service.womenSummer = function (callback) {
    var entityId = '3iDQHkMHa80WYCmYAoiggu';

    summer(entityId, function(err, data) {
        if(err)
            callback(err, null);
         else
            callback(null, data);
    })
};

service.byTypeAndName = function (type, name, callback) {
  var entry = service.getCache().get(type + '::' + name);
  if(entry) {
    callback(null, entry);
    return;
  }

  ContenfulClient.getClient().entries({
      'content_type': type,
      'fields.title': name
  }, function (err, entries) {
      if (err) {
          callback(err, null);
      } else {
        try {
          var fields = entries[0].fields;
          service.getCache().set(type + '::' + name, fields);
          callback(null, fields);
        } catch(e) {
          console.log(e);
        }
      }
  });
};

// service.getViewId = function(name) {
//   return Promise.resolve().then(function(){
//     var entry = service.getCache().get('views');
//
//     if (entry) return entry;
//
//     // return service.getClient().
//   }).then(function(views){
//
//   })
// }

service.process = function(content) {
  return service.pruneMetadataDeep(content);
}

/**
 * Remove all metadata from content references (sys), iterating through all deep references
 * @param  {Object} content Content retrieved from Contentful
 * @return {Object}         Pruned content
 */
service.pruneMetadataDeep = function(content) {
  if (typeof content.fields === 'object' && typeof content.sys === 'object'){
    return _.reduce(content.fields, function(result, field, key){
      if(typeof field === 'object'){
        if (_.isArray(field)){
          field = _.map(field, service.pruneMetadataDeep);
        } else {
          field = service.pruneMetadataDeep(field);
        }
      }
      result[key] = field;
      return result;
    }, {});
  }
}

service.getView = function (slug) {
  // Check if cache contains this view
  var content = service.getCache().get('view::' + slug);
  if (content) return Promise.resolve(content);

  // Fetch from Contentful
  return service.getClient().getEntries({
    'content_type': 'view',
    'fields.slug': slug
  })
  .then(function (entries) {
    if (!entries.total || entries.total < 1) throw new Error('No entries found');

    var view = _.get(entries, 'items[0].fields.view');
    if (!view) throw new Error('Entry received has wrong structure');

    var content = service.process(view);
    service.getCache().set('view::' + slug, content);

    return content;
  });
}

var summer = function (entityId, callback) {
    service.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields,
                eyewearIds = entity.eyewearProducts.split(','),
                sunglassesIds = entity.sunglassesProducts.split(',');

            // TODO: Populate products.
            ProductService.bySku(eyewearIds, function(err, result){
                entity.eyewearProducts = result;

                ProductService.bySku(sunglassesIds, function(err, result){
                    entity.sunglassesProducts = result;
                    callback(null, entity);
                });
            });
        }
    });
};

module.exports = service;
