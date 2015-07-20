'use strict';

angular.module('carts').filter('prescriptionName', function () {
    return function(input){
        switch(input){
            case 'sendlater':
                return 'Send Later';
            case 'calldoctor':
                return 'Call Doctor';
            case 'upload':
                return 'Upload File';
        }
    }
})
