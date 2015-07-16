'use strict';
var CustomObjectService = require('../services/sphere/sphere.custom-objects.server.service.js'),
    PrescriptionService = require('../services/sphere/sphere.prescriptions.server.service.js'),
    multiparty = require('multiparty'),
    Busboy = require('busboy'),
    MandrillService = require('../services/mandrill.server.service.js');

exports.create = function (req, res) {
    var cartId = req.param('cartId'),
        contents = req.body;

    delete contents._id

    PrescriptionService.create(cartId, contents, 'cart', function (err, result) {
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
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename);
        var bufs = [];
        var totalLength = 0;
        file.on('data', function(data) {
            console.log('File [' + fieldname + '] got ' + data.length/1024 + ' KB');
            //buffs.push(new Buffer(data, 'utf8'))
            if(data.length > 0) {
                bufs.push(data)
                totalLength += data.length
            }
            file.resume()
        });
        file.on('end', function() {
            var data = Buffer.concat(bufs, totalLength);
            MandrillService.sendAttachment('focali.dev@gmail.com', 'Prescription' ,'prescription-'+filename, data.toString('base64') , file.mimeType).then(function(res){
                console.log('Email sent')
            }, function(error){
                console.log('Error sending email')
                console.log(error)
            })
            console.log('File [' + fieldname + '] Finished. '+data.length/1024+' MB');
        });
    });
    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    });
    busboy.on('finish', function() {
        console.log('Done parsing form!');
        res.writeHead(303, { Connection: 'close', Location: '/' });
        res.end();
    });
    req.pipe(busboy);
}
