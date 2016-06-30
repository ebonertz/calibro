'use strict';

module.exports = function (app) {

    var controller = {}

    /**
     * Log Browser exceptions into Papertrail
     */
    controller.logError = function (req, res) {
        var data = req.body;

        // Fast check to verify we're receiving legit data. Is not 100% reliable, but will avoid most spam.
        if (data['stackTrace'] && data['url']) {
            app.logger.error('[BrowserException] %s',JSON.stringify(data));
            res.sendStatus(200);
        } else {
            res.sendStatus(400);
        }
    };

    return controller;
}
