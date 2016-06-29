var winston = require('winston'),
    config = require('./config');
require('winston-papertrail').Papertrail;

module.exports = function (app, config) {
    var level =config.logger.level;
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
        transports.push(new winston.transports.Papertrail({
            level: level,
            timestamp: true,
            colorize: false,
            host: config.papertrail.host,
            port: config.papertrail.port
        }));

        exceptionHandlers.push(new winston.transports.Papertrail({
            level: level,
            timestamp: true,
            colorize: false,
            host: config.papertrail.host,
            port: config.papertrail.port
        }));
    }

    var logger = app.logger = new (winston.Logger)({
        transports: transports,
        exceptionHandlers: exceptionHandlers,
        exitOnError: false
    });

    logger.info('[logger] initialized with [%s] level', level);
    return logger;
};

