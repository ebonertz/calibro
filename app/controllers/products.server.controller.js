'use strict';


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

        if (categoryA) {
            categoryAId = CategoriesService.getId(categoryA);
            if (categoryAId)
                categories.push(categoryAId);
            else {
                res.sendStatus(400);
                return;
            }
        }

        if (categoryB) {
            categoryBId = CategoriesService.getId(categoryB);
            if (categoryAId)
                categories.push(categoryBId);
            else {
                res.sendStatus(400);
                return;
            }
        }

        ProductService.listBy(categories, attributes, page, perPage, sortAttr, sortAsc).then(function (result) {
            res.json(result);
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
        });
    }
    return controller;
}




