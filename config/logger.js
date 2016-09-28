var winston = require('winston'),
    config = require('./config');
require('winston-papertrail').Papertrail;

module.exports = function (app, config) {
    var level =config.logger.level,
      log_setup_error_messages = [];

    var transports = [new (winston.transports.Console)({
        level: level,
        json: false,
        timestamp: true,
        colorize: false
    })];

    var exceptionHandlers = [new (winston.transports.Console)({
        level: level,
        json: false,
        timestamp: true,
        colorize: false,
        silent: false,
        prettyPrint: true
    })];

    if (config.papertrail && config.papertrail.host) {
      try {
        var papertrail_transport_options = {
            level: level,
            timestamp: true,
            colorize: false,
            host: config.papertrail.host,
            port: config.papertrail.port
        }

        var papetrail_transpot = new winston.transports.Papertrail(papertrail_transport_options);
        var papertrail_exception_transport = new winston.transports.Papertrail(papertrail_transport_options);

        transports.push(papertrail_transport);
        exceptionHandlers.push(papertrail_exception_transport);
      } catch(e) {
        log_setup_error_messages.push("Couldn't connect Papertrail log transport (endpoint: "+config.papertrail.host+':'+config.papertrail.port+')');
      }
    }

    var logger = app.logger = new (winston.Logger)({
        transports: transports,
        exceptionHandlers: exceptionHandlers,
        exitOnError: false
    });

    logger.info('[logger] initialized with [%s] level', level);
    log_setup_error_messages.forEach(function(error_msg){
      logger.error("[logger]", error_msg)
    })
    return logger;
};
