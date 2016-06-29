'use strict';

/**
 * Module dependencies.
 */
var customObjects = require('../controllers/custom-objects.server.controller.js'),
    entity = 'customObjects';

module.exports = function (app) {
    var commons = require('../controllers/commons.server.controller.js')(app);
    app.route('/custom-objects')
        .get(commons.list.bind({entity: entity}))
        .post(commons.create.bind({entity: entity}));

    app.route('/custom-objects/find')
        .get(customObjects.find);

    app.route('/custom-objects/:id')
        .get(commons.byId.bind({entity: entity}));

};
