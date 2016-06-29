'use strict';

var SphereClient = require('../../clients/sphere.server.client.js'),
  Customer = require('../../models/sphere/sphere.customer.server.model.js'),
  _ = require('lodash');


module.exports = function (app) {
    var service = {};

    var endpoints = {
        login: "/login",
        change_password: "/customers/password"
    }

    service.create = function (customer, callback) {
        return getSequenceNewValue("customerNumberSequence").then(function (customerNumber) {
            customer.customerNumber = customerNumber.toString();
            return SphereClient.getClient().customers.save(customer).then(function (result) {
                callback(null, result.body.customer);
            }).error(function (err) {
                app.logger.error ("Error creating customer. Error: %s",JSON.stringify(err));
                callback(err, null);
            });
        });
    };

    var getSequenceNewValue = function (sequence) {
        return SphereClient.getClient().customObjects
            .where('key="' + sequence + '"')
            .fetch()
            .then(function (res) {
                return res.body.results
            }).then(function (results) {
                if (!_.isEmpty(results)) {
                    return _.first(results);
                } else {
                    return {
                        value: 2000000
                    }
                }
            }).then(function (lastValue) {
                return {
                    value: lastValue.value + 1,
                    version: lastValue.version
                }
            }).then(function (newValue) {
                return SphereClient.getClient().customObjects.save({
                    container: sequence,
                    key: sequence,
                    value: newValue.value,
                    version: newValue.version
                }).then(function (res) {
                    return res.body.value;
                }).catch(function () {
                    return getSequenceNewValue(sequence);
                })
            });
    };

    service.login = function (email, password, anonymousCartId, callback) {
        var customer = {
            "email": email,
            "password": password,
            "anonymousCartId": anonymousCartId
        };

        app.logger.debug("anonymousCartId " + anonymousCartId)

        SphereClient.getClient().customers._save(endpoints['login'],customer).then(function (result) {
            var customer = new Customer(result.body.customer)
            callback(null, customer, result.body.cart);
        }).error(function (err) {
            app.logger.error ("Error doing login for customer. Error: %s",JSON.stringify(err));
            callback(err, null);
        });
    };

    /**
     * Update
     */

    service.updateProfile = function(customer, updateValues, callback){
        var actions = {
            version: customer.version,
            actions: []
        }

        if(updateValues.firstName || updateValues.lastName){
            var changeName = {action: 'changeName'}
            changeName.firstName = updateValues.firstName ? updateValues.firstName : customer.firstName;
            changeName.lastName = updateValues.lastName ? updateValues.lastName : customer.lastName;
            actions.actions.push(changeName)
        }

        if(updateValues.email){
            actions.actions.push({
                action: 'changeEmail',
                email: updateValues.email
            })
        }

        if(actions.actions.length < 1){
            callback(new Error("No values to update."), null)
        } else {
            app.logger.info("Updating  %s, version %s",customer.email,customer.version)
            SphereClient.getClient().customers.byId(customer.id).update(actions).then(function(result){
                // console.log(result);
                var customer = new Customer(result.body);
                callback(null, customer);
            }).error(function (err) {
                app.logger.error ("Error updating profile for customer. Error: %s",JSON.stringify(err));
                callback(err, null);
            });
        }
    }

    service.changePassword = function(customer, currentPassword, newPassword, callback){
        SphereClient.getClient().customers.byId(customer.id).fetch().then(function (result) {
            SphereClient.getClient().customers._save(endpoints['change_password'], {
                id: customer.id,
                version: result.body.version,
                currentPassword: currentPassword,
                newPassword: newPassword
            }).then(function (result) {
                callback(null, result.body)
            }).error(function (err) {
                app.logger.error ("Error changing password for customer. Error: %s",JSON.stringify(err));
                callback(err, null);
            });
        });
    }

    return service;
}
