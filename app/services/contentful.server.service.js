var ContenfulClient = require('../clients/contenful.server.client.js'),
    ProductService = require('../services/sphere/sphere.products.server.service.js');

/**
 * List
 */
exports.list = function (callback) {
    ContenfulClient.getClient().entries({}, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, entries);
        }
    });
};

exports.byId = function (id, callback) {
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

exports.home = function (callback) {
    var entityId = '3jUtHsj4y4QeGkWESIo0Qa';

    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

exports.help = function (callback) {
    var entityId = '3wp9hYrKBikSOSsE80Y8KG';

    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

exports.eyewear = function (gender,callback) {
    var entityId;
    if (gender == 'men') {
        entityId = "6jbTL9KhPOA8KA0sCQ4Y6I";
    }
   else if (gender == 'women'){
        entityId = '32Mzd4XlIkEYK4U2m2GOqM';
    }
    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });

};

exports.sunglasses = function (gender,callback) {
    if (gender == 'men') {
        entityId = "4TSQucctC8AOKeUaUA8Qc8";
    }
    else if (gender == 'women'){
        entityId = '3ifY0yAVI4wuukGIU2OOkA';
    }
    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

exports.menSummer = function (callback) {
    var entityId = '1RSBBWPySY08Wc2ScOWMwI';

    summer(entityId, function(err, data) {
        if(err)
            callback(err, null);
        else
            callback(null, data);
    })
};

exports.womenSummer = function (callback) {
    var entityId = '3iDQHkMHa80WYCmYAoiggu';

    summer(entityId, function(err, data) {
        if(err)
            callback(err, null);
         else
            callback(null, data);
    })
};

exports.byTypeAndName = function (type, name, callback) {
    ContenfulClient.getClient().entries({
        'content_type': type,
        'fields.name': name
    }, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });

};

var summer = function (entityId, callback) {
    exports.byId(entityId, function (err, entries) {
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
