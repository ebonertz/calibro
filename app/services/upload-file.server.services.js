'use strict';

var Busboy = require('busboy');
var cloudinary = require('../clients/cloudinary.server.client.js');
var cloudinaryClient = cloudinary.getClient();
var fs = require('fs');

module.exports = function (app) {

    var MandrillService = require('./mandrill.server.service.js')(app);
    var service = {};

    service.upload = function (req, callback) {
        var busboy = new Busboy({headers: req.headers});

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var fstream = fs.createWriteStream(__dirname + '/../../' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                cloudinaryClient.uploader.upload(__dirname + '/../../' + filename, function (result) {
                    fs.unlink(__dirname + '/../../' + filename, function (err) {
                        if (err) {
                            app.logger.error("Error deleting uploaded file: %s", JSON.stringify(err));
                        }
                        else {
                            app.logger.debug('file deleted successfully');
                        }
                    });

                    // Handle incoming errors here
                    if (result.error || !result) {
                      var error = result.error;

                      // Authorization error or unexpected error
                      if (error.http_code === 401 || !result) {
                        callback({
                          http_code: 503,
                          message: "There has been an issue uploading the file. Please contact us at welcome@focalioptics.com"
                        });
                      } else {
                        callback(error);
                      }
                    } else {
                      // If everything went alright
                      callback(null, result);
                    }
                });
            });

        })

        req.pipe(busboy);
    }

    /* Upload a file and send it in an email
     *      options:
     *          subject
     *          filename
     */

    service.uploadAndEmail = function (req, email, options, callback) {
        var busboy = new Busboy({headers: req.headers});

        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var bufs = [];
            var totalLength = 0;

            file.on('data', function (data) {
                // Push all the data parts
                if (data.length > 0) {
                    bufs.push(data)
                    totalLength += data.length
                }
                file.resume()
            });

            file.on('end', function () {
                // Concatenate data parts and send email
                var data = Buffer.concat(bufs, totalLength),
                    extension = filename.split('.').pop(),
                    new_filename = (options.filename ? options.filename + '.' + extension : filename),
                    file_response = {
                        original_name: filename,
                        new_name: new_filename
                    }
                MandrillService.sendAttachment(email, (options.subject ? options.subject : "Sphere.io attachment"), new_filename, data.toString('base64'), mimetype).then(function (res) {
                    file_response.size = data.length
                    callback(null, file_response)
                }, function (error) {
                    app.logger.error("Error sending attachment %s", JSON.stringify(error));
                    callback(error)
                });
            });
        })

        req.pipe(busboy);
    }

    return service;
}
