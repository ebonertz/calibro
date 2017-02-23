'use strict';

var Promise = require('bluebird'),
  _ = require('lodash');

module.exports = function (app) {
    var controller = {};
    var ProductService = require('../services/sphere/sphere.products.server.service.js')(app),
        CategoriesService = require('../services/sphere/sphere.categories.server.service')(app);

    /**
     *  Product detail page
     */

    controller.byId = function (req, res) {
        var id = req.params.id

        if (!id)
            return res.status(400);

        ProductService.byId(id, function (err, result) {
            if (err) {
                return res.status(400);
            } else {
                res.json(result);
            }
        })
    }

    controller.bySlug = function (req, res) {
        var slug = req.params.slug

        if (!slug)
            return res.status(400)

        ProductService.bySlugWithFacets(slug).then(function (result) {
            res.json(result);
        }).error(function (err) {
            res.sendStatus(400);
        });

    }

    controller.listBy = function (req, res) {
        var categoryA = req.params.categoryA,
            categoryB = req.params.categoryB,
            page = req.query.page,
            perPage = req.query.perPage,
            sortAttr = req.query.sortAttr,
            sortAsc = req.query.sortAsc;


        var categoryAId = null,
            categoryBId = null,
            attributes = req.body;

        var categories = [];

        return Promise.map(
          _.compact([categoryA, categoryB]),
          function(slug){
            return CategoriesService.bySlug(slug).then(function(catg){
              return catg ? catg.id : null;
            })
          }
        )
        .then(function(categories){
          var cats = _.compact(categories); // Remove empty values
          return ProductService.listBy(cats, attributes, page, perPage, sortAttr, sortAsc).then(function (result) {
            res.json(result);
          });
        })
        .catch(function(err) {
          res.sendStatus(err.statusCode || 500);
          if(!err.statusCode || err.statusCode !== 404){
            app.logger.error(err);
          }
        });
    }

    controller.search = function (req, res) {
        var text = req.params.text,
            page = req.query.page,
            perPage = req.query.perPage,
            sortAttr = req.query.sortAttr,
            sortAsc = req.query.sortAsc;

        var attributes = req.body;

        ProductService.search(text, attributes, page, perPage, sortAttr, sortAsc).then(function (result) {
            res.json(result);
        }).catch(function(err) {
          res.sendStatus(err.statusCode || 500);
          app.logger.error(err);
        });
    }
    return controller;
}
