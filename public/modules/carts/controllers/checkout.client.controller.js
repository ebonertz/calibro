'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService',
    'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'ProductUtils', 'Cart', 'Prescriptions',
    'AuthorizeNetService', 'ShippingMethodService', '$anchorScroll', 'Upload', 'ngProgressFactory',
    function ($scope, Authentication, $rootScope, CartService,
              ShippingMethods, Order, $location, Addresses, LoggerServices, ProductUtils, Cart, Prescription,
              AuthorizeNetService, ShippingMethodService, $anchorScroll, Upload, ngProgressFactory) {

        $scope.anchorScroll = function(where){
            $location.hash(where);
            $anchorScroll(where);
        }

        $scope.showPhasePrescription = function(){
            $scope.phasePrescription = true;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.anchorScroll(null);
        };
        $scope.showPhaseA = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = true;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.anchorScroll(null);
        };
        $scope.showPhaseB = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = true;
            $scope.phaseC = false;
            $scope.anchorScroll(null);
        };
        $scope.showPhaseC = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = true;
            $scope.anchorScroll(null);
        };

        $scope.cartPrescriptionCount = function(){
            var has = 0;
            for(var i in $rootScope.cart.lineItems){
                var line = $rootScope.cart.lineItems[i];
                if(line.distributionChannel.key != 'nonprescription'){
                    has+=line.quantity;
                }
            }
            return has;
        };

        $scope.showPhaseA();
        $scope.showPrescriptionSummary = false;

        var init = function () {
            if ($rootScope.cart != null) {
                if($scope.cartPrescriptionCount() > 0) {
                    $scope.showPhasePrescription();
                    $scope.showPrescriptionSummary = true;
                }

                if ($rootScope.cart.shippingAddress != null) {

                    if (Authentication.user.addresses != null && Authentication.user.addresses.length > 0) {
                        for (var i = 0; i < Authentication.user.addresses.length; i++) {
                            if ($rootScope.cart.shippingAddress.streetName == Authentication.user.addresses[i].streetName &&
                                $rootScope.cart.shippingAddress.streetNumber == Authentication.user.addresses[i].streetNumber &&
                                $rootScope.cart.shippingAddress.firstName == Authentication.user.addresses[i].firstName &&
                                $rootScope.cart.shippingAddress.lastName == Authentication.user.addresses[i].lastName) {
                                Authentication.user.addresses[i].selected = true;
                            }
                        }

                    }

                    $rootScope.loading = true;

                    ShippingMethodService.byLocationOneCurrency('US', null, 'USD', 'US').then(function (data) {
                        $scope.shippingMethods = data;

                        $rootScope.loading = false;

                        if ($rootScope.cart.shippingInfo != null) {
                            AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                                $scope.authorizeNet = data;

                                if (!$scope.$$phase)
                                    $scope.$apply();

                            });
                        }

                    });

                    if (!$scope.$$phase)
                        $scope.$apply();

                }

            } else {
                console.log("Cart is still null. Loading delay?");
            }
        };

        if ($rootScope.cart == null) {
            var cartWatch = $rootScope.$watch('cart', function(cart){
                if(cart != null) {
                    cartWatch()
                    init();
                }
            })
            //setTimeout(function () {
            //    init();
            //}, 2000);
        } else {
            init();
        }


        $scope.authentication = Authentication;
        $scope.$utils = ProductUtils;

        $scope.selectShippingAddress = function (shippingAddress) {
            $scope.selectedShippingAddress = shippingAddress;
            $rootScope.cart.shippingAddress = shippingAddress;
        }

        $scope.selectShippingMethod = function (shippingMethod) {
            $scope.selectedShippingMethod = shippingMethod;
        }

        $scope.setShippingAddress = function (shippingAddress) {
            if (!$rootScope.loading) {
                var finalShippingAddress = shippingAddress;

                if ($scope.selectedShippingAddress) {
                    finalShippingAddress = $scope.selectedShippingAddress;
                }

                $rootScope.loading = true;
                CartService.setShippingAddress($rootScope.cart.id, $rootScope.cart.version, {address: finalShippingAddress}).then(function (result) {

                    $rootScope.cart = result;
                    LoggerServices.success('Shipping address updated');

                    ShippingMethodService.byLocationOneCurrency('US', null, 'USD', 'US').then(function (data) {
                        $scope.shippingMethods = data;

                        if ($rootScope.cart.shippingInfo != null) {
                            for (var i = 0; i < $scope.shippingMethods.length; i++) {
                                if ($scope.shippingMethods[i].name == $rootScope.cart.shippingInfo.shippingMethodName) {
                                    $scope.shippingMethods[i].selected = true;
                                    $scope.selectedShippingMethod = $scope.shippingMethods[i];
                                }
                            }
                        }

                        $rootScope.loading = false;
                        $scope.showPhaseB();

                    });

                }, function(err){
                    LoggerServices.warning("Couldn't set shipping address, please try again");
                    $rootScope.loading = false;
                });
            }

        }

        $scope.setShippingMethod = function () {
            if (!$rootScope.loading && $scope.selectedShippingMethod) {
                $rootScope.loading = true;
                CartService.setShippingMethod($rootScope.cart.id, $rootScope.cart.version, {
                    shippingMethod: {
                        id: $scope.selectedShippingMethod.id,
                        typeId: "shipping-method"
                    }
                }).then(function (result) {
                    $rootScope.cart = result;

                    LoggerServices.success('Shipping method updated');

                    AuthorizeNetService.get($rootScope.cart.totalPrice.centAmount / 100).then(function (data) {
                        $scope.authorizeNet = data;

                        $scope.showPhaseC();

                        $rootScope.loading = false;
                    });
                }, function (error) {
                    $rootScope.loading = false;
                    LoggerServices.warning(error);
                });

            }
        }

        $scope.createOrder = function () {
            var order = new Order({
                id: $rootScope.cart.id,
                version: $rootScope.cart.version
            });

            order.$save(function (response) {
                console.log('Order created.');
                $('#authorizeNetForm').submit();
            }, function (error) {
                $rootScope.loading = false;
                LoggerServices.warning(error.data);
            });
        }


        $scope.addCustomerAddress = function (address, valid) {
            console.log(valid);

            var address = new Addresses(address);
            $rootScope.loading = true;

            address.$save(function (response) {
                Authentication.user = response;
                LoggerServices.success('Address added');
                $rootScope.loading = false;
                console.log("success address");
            }, function (response) {
                $scope.error = response.data.message;
                $rootScope.loading = false;
                LoggerServices.error(response);
            }, function (error) {
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });

        };

        $scope.validateShippingAddress = function () {
            return $rootScope.cart &&
                $rootScope.cart.shippingAddress &&
                $rootScope.cart.shippingAddress.streetName &&
                $rootScope.cart.shippingAddress.streetNumber &&
                $rootScope.cart.shippingAddress.firstName &&
                $rootScope.cart.shippingAddress.lastName &&
                $rootScope.cart.shippingAddress.country;
        };

        $scope.selectHighIndex = function(status){
            var method = status ? 'addHighIndex' : 'removeHighIndex';

            var highIndexLine = $scope.highIndexLine();
            var payload = {
                quantity: $scope.cartPrescriptionCount(),
                lineId: highIndexLine ? highIndexLine.id : null
            };

            // Don't remove if there's high-index line
            if(!highIndexLine && !status){
                return
            }

            $rootScope.loading = true;
            CartService[method]($rootScope.cart.id, $rootScope.cart.version, payload).then(function(result) {
                $rootScope.cart = result;
                if(status) LoggerServices.success('Added high-index lenses'); // I have the feeling no feedback should be given when no index lenses are selected
                $rootScope.loading = false;
            }, function(err){
                $rootScope.loading = false;
                LoggerServices.error('Could not save, please try again');
                console.log(err)
            })

            return false;
        };
        $scope.getPrescription = function(prescription){
            new Prescription({_id: $rootScope.cart.id}).$get().then(function(result){
                if(result.value) {
                    console.log(result.value)
                    $scope.prescription = result.value;
                    if($scope.prescription.type == 'reader'){
                        $scope.prescription.strength = $scope.prescription.data.strength;
                    }else if($scope.prescription.method == 'calldoctor'){
                        $scope.prescription.calldoctor = $scope.prescription.data;
                        $scope.highindex = true;
                        $scope.anchorScroll('calldoctor');
                    }else if($scope.prescription.method == 'sendlater'){
                        $scope.highindex = true;
                        $scope.anchorScroll('lensType');
                    }else if($scope.prescription.method == 'upload'){
                        $scope.highindex = true;
                        $scope.file = result.value.data;
                    }
                }
            });
        }
        $scope.savePrescription = function(type_method, valid){
            $scope.savedPrescription = {}
            var data = {}

            // Fast fix
            $scope.prescription = $scope.prescription || {}

            var save = function(type, method, data, callback){
                $rootScope.loading = true;
                new Prescription({
                    _id: $rootScope.cart.id,
                    type: type,
                    method: method,
                    data: data
                }).$save(function(response){
                    $scope.prescription = response.value;
                    if($scope.prescription.type == 'reader'){
                        $scope.prescription.strength = $scope.prescription.data.strength;
                    }else if($scope.prescription.method == 'calldoctor'){
                        $scope.prescription.calldoctor = $scope.prescription.data;
                    }

                    $rootScope.loading = false;
                    LoggerServices.success('Prescription saved');
                    callback(response);
                }, function (response) {
                    $scope.error = response.data.message;
                    $rootScope.loading = false;
                    LoggerServices.error(response);
                }, function (error) {
                    $rootScope.loading = false;
                    LoggerServices.warning(error);
                });
            }
            switch(type_method){
                case 'reader':
                    if(!valid) return false

                    if($scope.highIndexLine() != null) $scope.selectHighIndex(false);
                    data = {strength: $scope.prescription.strength}
                    save('reader', null, data, function(){
                        $scope.showPhaseA();
                    });

                    break;

                case 'calldoctor':
                    if(valid) {
                        data = $scope.prescription.calldoctor
                        save('prescription', 'calldoctor', data, function(){
                            $scope.highindex = true;
                            $scope.anchorScroll('calldoctor');
                        });
                    }
                    break;

                case 'sendlater':
                    save('prescription', 'sendlater', '', function(){
                        $scope.anchorScroll('lensType');
                        $scope.highindex = true;
                    })
                    break;

                case 'upload':
                    save('prescription', 'upload', $scope.file, function(){
                        $scope.highindex = true;
                    })
            }
        };

        $scope.uploadPrescription = function(files) {
            $scope.progressbar = ngProgressFactory.createInstance();
            $scope.progressbar.set(0);
            //$scope.progressbar.color('#00A2E1');

            var finished = false,
                extensions = ['jpg', 'jpeg', 'png', 'pdf'],
                maxSizeMB = 20; // 20MB

            if (files && files.length > 0){
                if(extensions.indexOf(files[0].name.split('.').pop()) < 0){
                    LoggerServices.error('Incorrect file format')
                }else if(files[0].size/(1024*1024) > maxSizeMB){
                    LoggerServices.error('File size exceeded (max. '+maxSizeMB+'MB)')
                }else {
                    Upload.upload({
                        url: '/prescriptions/upload',
                        file: files[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        if (!finished) $scope.progressbar.set(progressPercentage);

                        $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function (data, status, headers, config) {
                        finished = true;
                        $scope.progressbar.complete();

                        LoggerServices.success("Prescription uploaded")
                        $scope.prescription.method = 'upload';
                        $scope.highindex = true;

                        $scope.file = data; // {new_filename, original_filename, file_size}
                        $scope.savePrescription('upload')
                        //$timeout(function () {
                        //    $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        //});
                    }).error(function (data, status, headers, config) {
                        console.log(status)
                        // handle error
                    })
                }
            }
        }

        $scope.highIndexLine = function(){
            for(var i in $rootScope.cart.customLineItems){
                var line = $rootScope.cart.customLineItems[i];
                if(line.slug == 'high-index-lens') {
                    return line;
                }
            }
            return null
        };
    }
])
;
