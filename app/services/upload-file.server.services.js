'use strict';

var Busboy = require('busboy'),
    MandrillService = require('./mandrill.server.service.js');

/* Upload a file and send it in an email
 *      options:
 *          subject
 *          filename
 */

exports.uploadAndEmail = function(req, email, options, callback){
    var busboy = new Busboy({ headers: req.headers });

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var bufs = [];
        var totalLength = 0;

        file.on('data', function(data) {
            // Push all the data parts
            if(data.length > 0) {
                bufs.push(data)
                totalLength += data.length
            }
            file.resume()
        });

        file.on('end', function() {
            // Concatenate data parts and send email
            var data = Buffer.concat(bufs, totalLength),
                extension = filename.split('.').pop(),
                new_filename = (options.filename ? options.filename + '.' + extension : filename),
                file_response = {
                    original_name: filename,
                    new_name: new_filename
                }

            MandrillService.sendAttachment(email, (options.subject ?  options.subject : "Sphere.io attachment"), new_filename, data.toString('base64'), mimetype).then(function (res) {
                file_response.size = data.length
                callback(null, file_response)
            }, function (error) {
                console.log(error)
                callback(error)
            });
        });
    })

    req.pipe(busboy);
}
