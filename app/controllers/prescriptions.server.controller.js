'use strict';
var config = require('../../config/config');

module.exports = function (app) {
    var controller = {};
    var PrescriptionService = require('../services/sphere/sphere.prescriptions.server.service.js')(app);
    var MandrillService = require('../services/mandrill.server.service.js')(app);

    var UploadFileService = require('../services/upload-file.server.services.js')(app);

    controller.create = function (req, res) {
        var cartId = req.param('cartId'),
            version = req.param ('version'),
            contents = req.body;

        delete contents._id;
        delete contents.version;

        PrescriptionService.create(cartId,version, contents, function (err, result) {
            if (err) {
                return res.sendStatus(400);
            } else {
                res.json(result);
            }
        });
    };

    controller.byCart = function (req, res) {
      var cartId = req.param('cartId');

      PrescriptionService.byId(cartId, function (err, result) {
        if (err) {
          // This should be handled in the service, but can't due to backwards-compatibility
          var status = (err.body || {}).statusCode || 500;

          return res.sendStatus(status);
        } else {
          res.json(result);
        }
      })
    }

    controller.upload = function (req, res) {
        // TODO: Check file size
        // TODO: Check file extension

       UploadFileService.upload(req, function (err, file_data) {
            if (err) {
              return res.status(err.http_code || 503).send(err.message)
            } else {
                res.json({
                    original_filename: file_data.original_filename,
                    file_size: (file_data.bytes / (1024 * 1024)).toFixed(2) + "MB",
                    url: file_data.url,
                    secure_url: file_data.secure_url
                })
            }
        })

    };

    return controller;
}
