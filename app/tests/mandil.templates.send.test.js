'use strict';

/**
 * Module dependencies.
 */
var should = require('should');

var MandrillService = require('../services/mandrill.server.service.js');
var SphereClient = require('../clients/sphere.server.client.js');
var config = require('../../config/config');


/**
 * Globals
 */

SphereClient.getClient().orders
      .byId("f773633f-80af-4ebb-88e2-fec70c8c9ab9")
      .fetch()
      .then(function (res) {
        return res.body;
      }).then(function (orderCreated) {
        MandrillService.orderConfirmation("elxema@hotmail.com", orderCreated, config.serverPath + '/#!/orders/' + orderCreated.id);

      });



