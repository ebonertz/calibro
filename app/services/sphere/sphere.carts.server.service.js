var SphereClient = require('../../clients/sphere.server.client.js');

var actions = {
    addLineItem: 'addLineItem',
    removeLineItem: 'removeLineItem',
    changeLineItemQuantity: 'changeLineItemQuantity',
    addCustomLineItem: 'addCustomLineItem'
}

/**
 * List
 */
exports.list = function (callback) {
    SphereClient.getClient().carts.all().fetch().then(function (resultArray) {
        callback(null, resultArray.body.results);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};


exports.create = function (cart, callback) {
    SphereClient.getClient().carts.save(cart).then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.byId = function (id, callback) {
    SphereClient.getClient().carts.byId(id).fetch().then(function (result) {
        callback(null, result.body);
    }).error(function (err) {
        console.log(err);
        callback(err, null);
    });
};

exports.update = function (cartId, actions, callback) {
    SphereClient.getClient().carts.byId(cartId).fetch().then(function (result) {
        SphereClient.getClient().carts.byId(cartId).update({
            version: result.body.version,
            actions: actions
        }).then(function (result) {
            callback(null, result.body)
        }).error(function (err) {
            console.log(err);
            callback(err, null);
        });
    });
};


exports.addLineItem = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.addLineItem;

    exports.update(cartId, [payload], function (err, result) {
        callback(err, result);
    });
}

exports.removeLineItem = function (cartId, payload, callback) {
    if (payload)
        payload.action = actions.removeLineItem;

    update(cartId, [payload], function (err, result) {
        callback(err, result);
    });
}
