'use strict';
var CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    PrescriptionService = require('../services/sphere/sphere.prescriptions.server.service.js'),
    UploadFileService = require('../services/upload-file.server.services.js'),
    config = require('../../config/config');

exports.create = function (req, res) {
    var cartId = req.param('cartId'),
        contents = req.body;

    delete contents._id;

    PrescriptionService.create(cartId, contents, function (err, result) {
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    });
};

exports.byCart = function (req, res) {
    var cartId = req.param('cartId');

    PrescriptionService.byId(cartId, function(err, result){
        if (err) {
            return res.sendStatus(400);
        } else {
            res.json(result);
        }
    })
}

exports.upload = function(req, res) {
    // TODO: Check cart
    // TODO: Check file size
    // TODO: Check file extension

    // TODO: Move to upload service
    // Should upload to temp and send an email when order is created. This is just the simple way around.

    PrescriptionService.getLastUploadId(function(err, result){
        if(err){
            return res.sendStatus(400)
        }else{
            var counter = result.value + 1,
                options = {
                    subject: 'Prescription #'+counter,
                    filename: 'prescription-' + counter
                }
            UploadFileService.uploadAndEmail(req, config.mandrill.addresses.prescriptions_email, options, function(err, file_data){
                if(err){
                    return res.sendStatus(400)
                }else {
                    PrescriptionService.updateLastUploadId(counter);
                    res.json({
                        new_filename: file_data.new_name,
                        original_filename: file_data.original_name,
                        file_size: (file_data.size / (1024 * 1024)).toFixed(2) + "MB"
                    })
                }
            })
        }
    })



};
