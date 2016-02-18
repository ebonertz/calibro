'use strict';

angular.module('core').service('LoggerServices', ['$log', 'toastr',
    function ($log, toastr) {

        // This logger wraps the toastr logger and also logs to console
        // toastr.js is library by John Papa that shows messages in pop up toast.
        // https://github.com/CodeSeven/toastr

        /*toastr.options = {
         "closeButton": false,
         "debug": false,
         "positionClass": "toast-bottom-right",
         "onclick": null,
         "showDuration": "300",
         "hideDuration": "1000",
         "timeOut": "5000",
         "extendedTimeOut": "1000",
         "showEasing": "swing",
         "hideEasing": "linear",
         "showMethod": "fadeIn",
         "hideMethod": "fadeOut"
         };*/


        var logger = {
            error: error,
            info: info,
            infoLong: infoLong,
            success: success,
            warning: warning,
            desktopNotification: desktopNotification,
            log: $log.log // straight to console; bypass toast
        };

        return logger;

        //#region implementation
        function error(message, title) {
            toastr.error(message, title,{
                positionClass: 'toast-bottom-right'
            });
            $log.error("Error: " + message);
        }

        function info(message, title) {
            toastr.info(message, title,{
                positionClass: 'toast-bottom-right'
            });
            $log.info("Info: " + message);
        }

        function infoLong(message, title) {
            toastr.info(message, title, {timeOut: 20000,positionClass: 'toast-bottom-right'});
            $log.info("Info: " + message);
        }

        function success(message, title) {
            toastr.success(message, title,{
                positionClass: 'toast-bottom-right'
            });
            $log.info("Success: " + message);
        }

        function warning(message, title) {
            toastr.warning(message, title,{
                positionClass: 'toast-bottom-right'
            });
            $log.warn("Warning: " + message);
        }

        function desktopNotification(message, title) {

            var options = {
                body: message,
                icon: "icon.jpg",
                dir: "ltr"
            };

            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                alert("This browser does not support desktop notification");
            }

            // Let's check if the user is okay to get some notification
            else if (Notification.permission === "granted") {
                var notification = new Notification(title, options);
            }

            // Otherwise, we need to ask the user for permission
            // Note, Chrome does not implement the permission static property
            // So we have to check for NOT 'denied' instead of 'default'
            else if (Notification.permission !== 'denied') {
                Notification.requestPermission(function (permission) {
                    // Whatever the user answers, we make sure we store the information
                    if (!('permission' in Notification)) {
                        Notification.permission = permission;
                    }
                    // If the user is okay, let's create a notification
                    if (permission === "granted") {

                        var notification = new Notification(title, options);
                    }
                });
            }

            // At last, if the user already denied any notification, and you
            // want to be respectful there is no need to bother them any more.
        }

    }
]);
