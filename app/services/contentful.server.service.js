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
    var homeEntityId = '2XBFCfxbqMooI40CqMQ4E6';

    exports.byId(homeEntityId, function (err, entries) {
        if (err) {
            callback(err, null);
        } else {
            var entity = entries[0].fields,
                eyewearIds = entity.eyewearProducts.split(','),
                sunglassesIds = entity.sunglassesProducts.split(',');

            // TODO: Populate products.

            callback(null, entity);
        }
    });
};
