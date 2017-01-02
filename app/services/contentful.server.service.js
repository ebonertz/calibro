var ContenfulClient = require('../clients/contenful.server.client.js'),
    ProductService = require('../services/sphere/sphere.products.server.service.js'),
    config = require('../../config/config');

var NodeCache = require('node-cache');

var cache;
var service = {};

service.getCache = function() {
  if (!(cache instanceof NodeCache)) {
    ttl = config.contentful.cache.ttl
    cache = ttl ? new NodeCache({
      stdTTL: ttl,
    }) : new NodeCache();
  }
  return cache;
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
