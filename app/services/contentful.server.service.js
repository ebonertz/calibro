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
    var entityId = '2XBFCfxbqMooI40CqMQ4E6';

    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;
            callback(null, entity);
        }
    });
};

exports.eyewear = function (callback) {
    var entityId = 'voZfsMgZlQOgykUm66gmy';

    exports.byId(entityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields;

            // TODO: Populate products.
            ProductService.bySku([entity.menProduct], function(err, result){
                entity.menProduct = result;

                ProductService.bySku([entity.womenProduct], function(err, result){
                    entity.womenProduct = result;
                    callback(null, entity);
                });
            });
        }
    });
};


exports.menSummer = function (callback) {
    var entityId = '1RSBBWPySY08Wc2ScOWMwI';

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

exports.womenSummer = function (callback) {
    var entityId = '3iDQHkMHa80WYCmYAoiggu';

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
