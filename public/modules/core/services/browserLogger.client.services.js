'use strict';
/**
 * Override Angular's built in exception handler, and tell it to
 * use our new exceptionLoggingService which is defined below
 */
angular.module('core').provider(
    "$exceptionHandler", {
        $get: function (exceptionLoggingService) {
            return (exceptionLoggingService);
        }
    }
);

/**
 * Exception Logging Service, currently only used by the $exceptionHandler
 * it preserves the default behaviour ( logging to the console) but
 * also posts the error server side after generating a stacktrace.
 */
angular.module('core').factory(
    "exceptionLoggingService", ["$log", "$window", 'Authentication',
        function ($log, $window, Authentication) {
            function error(exception, cause) {
                // preserve the default behaviour which will log the error
                // to the console, and allow the application to continue running.
                $log.error.apply($log, arguments);
                var customer = Authentication.user ? Authentication.user.id : 'Anonymous';

                try {
                    var errorMessage = exception.toString();

                    // use our traceService to generate a stack trace
                    StackTrace.fromError(exception).then(function (stackTrace) {
                        // console.log(stackTrace);
                        $.ajax({
                            type: "POST",
                            url: "/api/log",
                            contentType: "application/json",
                            data: angular.toJson({
                                browser: navigator.userAgent,
                                url: $window.location.href,
                                message: errorMessage,
                                type: "exception",
                                stackTrace: stackTrace,
                                cause: (cause || ""),
                                customer: customer
                            })
                        });

                    });
                } catch (loggingError) {
                    $log.warn("Error server-side logging failed");
                    $log.log(loggingError);
                }
            }

            return (error);
        }
    ]
);
