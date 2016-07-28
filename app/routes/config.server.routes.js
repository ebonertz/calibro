'use strict';

module.exports = function (app) {
    var configController = require('../controllers/config.server.controller')(app);

    app.route('/api/config')
        .get(configController.get);
};
