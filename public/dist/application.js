'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'focali-mean';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',
		'ui.router', 'ui.utils', 'ipCookie', 'toastr', 'pasvaz.bindonce', 'djds4rce.angular-socialshare',
		'ngFileUpload', 'ngProgress','angular-loading-bar','ngLodash','sn.addthis'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule,

		defaults: {
			currency: 'USD',
			locale: 'en'
		}
	};
})();

'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider','$httpProvider',
	function($locationProvider,$httpProvider) {
		//$locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		//$httpProvider.interceptors.push('headTagsInterceptor');
	}
]).run(["$rootScope", "CartService", "CustomerService", "$anchorScroll", "$FB", function ($rootScope, CartService, CustomerService, $anchorScroll, $FB) {
	CustomerService.checkCookieAndLogin();
	CartService.pageLoad();
	//console.log(Authentication)
	//$rootScope.cart = CartService.createAnonymous();
	$rootScope.$on('$viewContentLoaded', function() {

		// Scroll to Top
		// Set ture for animation which isn't needed in my case
		$anchorScroll();

	});

	$FB.init('841888042555433');
}]).constant('appDefaults', ApplicationConfiguration.defaults);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});

'use strict';


// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('braintree');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('carts');

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core', ['adaptive.detection']);

'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('customers');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('misc');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('orders');

'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('products', ['pasvaz.bindonce']);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('braintree').service('BraintreeService', ['$http', '$q',
    function ($http, $q) {

        this.clientToken = function (userId) {
            var deferred = $q.defer();
            var queryString = "";
            if (userId) {
              queryString += "?customerId=" + userId
            }
            $http.get('/braintree/clientToken'+queryString).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.checkout = function (checkoutParameters) {
            var deferred = $q.defer();

            $http.post('/braintree/checkout',checkoutParameters).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }


    }
]);

'use strict';

//Setting up route
angular.module('carts').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.
            state('cart', {
                url: '/cart',
                templateUrl: 'modules/carts/views/cart.client.view.html'
            }).
            state('viewCart', {
                url: '/carts/:id',
                templateUrl: 'modules/carts/views/view-cart.client.view.html'
            }).
            state('checkout', {
                url: '/checkout',
                templateUrl: 'modules/carts/views/checkout.client.view.html'
            }).
            state('test', {
                url: '/test',
                templateUrl: 'modules/carts/views/test.html'
            });
    }
]);

'use strict';

angular.module('carts').controller('CartController', ['$scope', 'Authentication', 'CartService', '$rootScope', '$location', 'LoggerServices', 'Cart', '$stateParams', 'OrderService','ipCookie',
    function ($scope, Authentication, CartService, $rootScope, $location, LoggerServices, Cart, $stateParams, OrderService,ipCookie) {
        $scope.authentication = Authentication;
        $scope.isCheckout = $location.path().indexOf('checkout') > -1;

        $scope.proceedToCheckout = function () {
            if ($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0) {
                var cookieId = null;
                if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
                    cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
                }
                if (!Authentication.user && cookieId) {
                    CartService.refreshCart(cookieId).then(function (cart) {
                        $rootScope.cart = cart;
                        $location.path('/checkout');
                    });
                }
                else {
                    $location.path('/checkout');
                }


            }

        }

        $scope.removeFromCart = function (item) {
            CartService.removeFromCart(item);
        };

        $scope.addDiscountCode = function (code) {
            if (code != null) {

                $rootScope.loading = true;
                CartService.addDiscountCode($rootScope.cart.id, $rootScope.cart.version, {
                    code: code
                }).then(function (result) {
                    $rootScope.cart = result;
                    $rootScope.loading = false;
                    LoggerServices.success('Discount applied.');
                }, function (error) {
                    $rootScope.loading = false;
                    LoggerServices.warning(error);
                });
            }

        }

        $scope.increaseLineItemQuantity = function (item) {
            item.quantity++;
            $rootScope.loading = true;
            CartService.changeLineItemQuantity($rootScope.cart.id, $rootScope.cart.version, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            }, function (error) {
                item.quantity--;
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });
        }

        $scope.decreaseLineItemQuantity = function (item) {
            item.quantity--;
            $rootScope.loading = true;
            CartService.changeLineItemQuantity($rootScope.cart.id, $rootScope.cart.version, {
                lineItemId: item.id,
                quantity: item.quantity
            }).then(function (result) {
                $rootScope.cart = result;
                $rootScope.loading = false;
                LoggerServices.success('Quantity updated.');
            }, function (error) {
                item.quantity++;
                $rootScope.loading = false;
                LoggerServices.warning(error);
            });
        }

        $scope.findOne = function () {
            Cart.get({
                cartId: $stateParams.id
            }, function (data) {
                $scope.cart = data;
            });
        };


    }
]);

'use strict';

angular.module('carts').controller('CheckoutController', ['$scope', 'Authentication', '$rootScope', 'CartService', 'ShippingMethods', 'Order', '$location', 'Addresses', 'LoggerServices', 'Cart', 'ShippingMethodService', '$anchorScroll', '$window', 'Prescriptions', 'Upload', 'ngProgressFactory','AddressSelector','BraintreeService','ipCookie','$http',
    function ($scope, Authentication, $rootScope, CartService, ShippingMethods, Order, $location, Addresses, LoggerServices, Cart,  ShippingMethodService, $anchorScroll, $window, Prescription, Upload, ngProgressFactory,AddressSelector,BraintreeService,ipCookie,$http) {
        $scope.dataStates = AddressSelector.dataStates;
        $scope.card = {};
        $scope.loadingPayPal = 0;
        $scope.eyewearPrescriptionCount = 0;
        $scope.billingMethods = [
            {name: 'Credit Card'},
            {name: 'PayPal'}
        ];
        $scope.highindex = false;
        $scope.blueBlock = false;

        $scope.anchorScroll = function (where) {
            $location.hash(where);
            $anchorScroll(where);
        };

        $scope.showPhasePrescription = function () {
            $scope.phasePrescription = true;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.phaseD = false;
            $scope.phaseE = false;
            $scope.anchorScroll(null);
        };

        $scope.showPhaseA = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = true;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.phaseD = false;
            $scope.phaseE = false;
            $scope.anchorScroll(null);
        }
        $scope.showPhaseB = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = true;
            $scope.phaseC = false;
            $scope.phaseD = false;
            $scope.phaseE = false;
            $scope.anchorScroll(null);
        }
        $scope.showPhaseC = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = true;
            $scope.phaseD = false;
            $scope.phaseE = false;
            $scope.anchorScroll(null);
            BraintreeService.clientToken().then(function (response) {
                if (response.success === true) {
                    braintree.setup(response.clientToken, "dropin", {
                        container: 'dropin-container',
                        onPaymentMethodReceived: function (obj) {
                        $scope.paymentInfo = obj;   //"PayPalAccount
                        $scope.showPhaseD();
                            $scope.$apply();
                        }
                    });
                }
            });
        }

        $scope.showPhaseD = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.phaseD = true;
            $scope.phaseE = false;
            $scope.anchorScroll(null);
        }

        $scope.showPhaseE = function () {
            $scope.phasePrescription = false;
            $scope.phaseA = false;
            $scope.phaseB = false;
            $scope.phaseC = false;
            $scope.phaseD = false;
            $scope.phaseE = true;
            $scope.anchorScroll(null);
        }


        $scope.cartPrescriptionCount = function () {
            var has = 0;
            for (var i in $rootScope.cart.lineItems) {
                var line = $rootScope.cart.lineItems[i];
                if (line.distributionChannel.key && line.distributionChannel.key != 'nonprescription' || line.distributionChannel.obj && line.distributionChannel.obj.key && line.distributionChannel.obj.key != 'nonprescription') {
                    has += line.quantity;
                }
            }
            return has;
        };


        if ($location.search().jumpto == null) {
            $scope.showPhaseA();
        } else {
            if ($location.search().jumpto == 'billingMethod') {
                $scope.showPhaseC();
                LoggerServices.warning('There was a problem on the Payment site.');
            } else {
                $scope.showPhaseA();
            }
        }

        $scope.showPrescriptionSummary = false;

        var determineHighIndexBlueBlockVisibility = function () {
            CartService.cartEyewearPrescriptionCount($rootScope.cart.id).then(function (result) {
                $scope.cartEyewearPrescriptionCount = result;
                if (result > 0) {
                    $scope.highindex = true;
                    $scope.blueBlock = true;
                }
            });


        }
        var init = function () {
            if ($rootScope.cart != null) {
                $http.get('/api/carts/'+$rootScope.cart.id)
                  .then(function(cart){
                      $rootScope.cart = cart.data;
                      if ($scope.cartPrescriptionCount() > 0) {
                          determineHighIndexBlueBlockVisibility();
                          $scope.showPhasePrescription();
                          $scope.showPrescriptionSummary = true;
                      }

                      if ($rootScope.cart.shippingAddress != null) {

                          if (Authentication.user && Authentication.user.addresses != null && Authentication.user.addresses.length > 0) {
                              for (var i = 0; i < Authentication.user.addresses.length; i++) {
                                  if ($rootScope.cart.shippingAddress.streetName == Authentication.user.addresses[i].streetName &&
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

                          });

                          if (!$scope.$$phase)
                              $scope.$apply();

                      }

                  });

            } else {
                console.log("Cart is still null. Loading delay?");
            }
        }

        if ($rootScope.cart == null) {
            var cartWatch = $rootScope.$watch('cart', function (cart) {
                if (cart != null) {
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

        $scope.selectShippingAddress = function (shippingAddress) {
            $scope.selectedShippingAddress = shippingAddress;
            $rootScope.cart.shippingAddress = shippingAddress;
        }

        $scope.selectShippingMethod = function (shippingMethod) {
            $scope.selectedShippingMethod = shippingMethod;
        }

        $scope.selectBillingAddress = function (billingAddress) {
            $scope.selectedBillingAddress = billingAddress;
            $rootScope.cart.billingAddress = billingAddress;
        }

        $scope.setShippingAddress = function (shippingAddress) {
            if (!$rootScope.loading) {
                var finalShippingAddress = shippingAddress;

                if ($scope.selectedShippingAddress) {
                    finalShippingAddress = $scope.selectedShippingAddress;
                }

                $rootScope.loading = true;
                CartService.setShippingAddress($rootScope.cart.id, {address: finalShippingAddress}).then(function (result) {

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

                }, function (err) {
                    LoggerServices.warning(err);
                    $rootScope.loading = false;
                });
            }

        }


        $scope.setBillingAddress = function (billingAddress) {
            if (!$rootScope.loading) {
                var finalBillingAddress = billingAddress;

                if ($scope.selectedBillingAddress) {
                    finalBillingAddress = $scope.selectedBillingAddress;
                }

                $rootScope.loading = true;
                CartService.setBillingAddress($rootScope.cart.id, {address: finalBillingAddress}).then(function (result) {
                    $rootScope.cart = result;
                    LoggerServices.success('Billing address updated');
                    $scope.showPhaseE();

                });
            }
        }

        $scope.setShippingMethod = function () {
            if (!$rootScope.loading && $scope.selectedShippingMethod) {
                $rootScope.loading = true;
                CartService.setShippingMethod($rootScope.cart.id, {
                    shippingMethod: {
                        id: $scope.selectedShippingMethod.id,
                        typeId: "shipping-method"
                    }
                }).then(function (result) {
                    $rootScope.cart = result;

                    LoggerServices.success('Shipping method updated');
                    $scope.showPhaseC();
                    $rootScope.loading = false;

                }, function (error) {
                    $rootScope.loading = false;
                    LoggerServices.warning(error);
                });

            }
        }

        $scope.placeOrder = function () {
            event.preventDefault();
            var order = new Order({
                id: $rootScope.cart.id,
                version: $rootScope.cart.version
            });

            order.$save(function (order) {
                $scope.order = order;
                processPaymentMethods (order);
            }, function (error) {
                $rootScope.loading = false;
                LoggerServices.warning(error.data);
            });

        }

        var processPaymentMethods = function (order) {
            var customerId = Authentication.user ? Authentication.user.id : undefined;
            if ($scope.paymentInfo) {
                var checkoutParameters = {
                    payment_method_nonce: $scope.paymentInfo.nonce,
                    submitForSettlement: false,
                    customerId: customerId,
                    orderId: order.id
                }

                BraintreeService.checkout(checkoutParameters).then(function (response) {
                    $scope.paymentInfo = undefined;
                    if (response.success === true) {
                        LoggerServices.success("Payment was authorized");
                        $location.path('/orders/' + order.id);
                    }
                    else {
                        LoggerServices.warning("Payment was not authorized. Message: " + response.message + "Order:  " + order.id);
                    }

                    var customerId = Authentication.user ? Authentication.user.id : undefined;
                    var cookieId = null;

                    if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
                        cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
                    }
                    CartService.init(customerId, cookieId).then(function (cart) {
                        $rootScope.cart = cart;
                    });


                });
            }


        };




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
                $rootScope.cart.shippingAddress.firstName &&
                $rootScope.cart.shippingAddress.lastName &&
                $rootScope.cart.shippingAddress.postalCode &&
                $rootScope.cart.shippingAddress.city &&
                $rootScope.cart.shippingAddress.country;
        };

        $scope.validateBillingAddress = function () {
            return $rootScope.cart &&
                $rootScope.cart.billingAddress &&
                $rootScope.cart.billingAddress.streetName &&
                $rootScope.cart.billingAddress.firstName &&
                $rootScope.cart.billingAddress.lastName &&
                $rootScope.cart.billingAddress.postalCode &&
                $rootScope.cart.billingAddress.city &&
                $rootScope.cart.billingAddress.country;
        };

        $scope.validateCreditCard = function () {
            return $scope.card.card_number != null && $scope.card.card_exp != null && $scope.card.card_security_code != null;
        };


        $scope.selectHighIndex = function (status) {
            var method = status ? 'addHighIndex' : 'removeHighIndex';

            var highIndexLine = $scope.highIndexLine();
            var payload = {
                quantity: $scope.cartEyewearPrescriptionCount,
                lineId: highIndexLine ? highIndexLine.id : null
            };

            // Don't remove if there's high-index line
            if (!highIndexLine && !status) {
                return
            }

            $rootScope.loading = true;
            CartService[method]($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
                $rootScope.cart = result;
                if (status) LoggerServices.success('Added high-index lenses'); // I have the feeling no feedback should be given when no index lenses are selected
                $rootScope.loading = false;
            }, function (err) {
                $rootScope.loading = false;
                LoggerServices.error('Could not save, please try again');
                console.log(err)
            })

            return false;
        };

        $scope.selectBlueBlock = function (status) {
            var method = status ? 'addBlueBlock' : 'removeBlueBlock';

            var blueBlockLine = $scope.blueBlockLine();
            var payload = {
                quantity: $scope.cartEyewearPrescriptionCount,
                lineId: blueBlockLine ? blueBlockLine.id : null
            };

            // Don't remove if there's blueBlock line
            if (!blueBlockLine && !status) {
                return
            }

            $rootScope.loading = true;
            CartService[method]($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
                $rootScope.cart = result;
                if (status) LoggerServices.success('Added Blue Block AR'); // I have the feeling no feedback should be given when no index lenses are selected
                $rootScope.loading = false;
            }, function (err) {
                $rootScope.loading = false;
                LoggerServices.error('Could not save, please try again');
                console.log(err)
            })

            return false;
        };







        $scope.getPrescription = function (prescription) {
            new Prescription({_id: $rootScope.cart.id}).$get().then(function (result) {
                if (result.value) {
                    console.log(result.value)
                    $scope.prescription = result.value;
                    if ($scope.prescription.type == 'reader') {
                        $scope.prescription.strength = $scope.prescription.data.strength;
                    } else if ($scope.prescription.method == 'calldoctor') {
                        $scope.prescription.calldoctor = $scope.prescription.data;
                        $scope.anchorScroll('calldoctor');
                    } else if ($scope.prescription.method == 'sendlater') {
                        $scope.anchorScroll('lensType');
                    } else if ($scope.prescription.method == 'upload') {
                        $scope.prescription.upload = result.value.data;
                    }
                }
            });
        }
        $scope.savePrescription = function (type_method, valid) {
            $scope.savedPrescription = {}
            var data = {}

            // Fast fix
            $scope.prescription = $scope.prescription || {}

            var save = function (type, method, data, callback) {
                $rootScope.loading = true;
                new Prescription({
                    _id: $rootScope.cart.id,
                    version: $rootScope.cart.version,
                    type: type,
                    method: method,
                    data: data
                }).$save(function (response) {
                        $scope.prescription = response.prescription;
                        $scope.prescription.method = response.prescription.value.method;
                        $scope.prescription.type = response.prescription.value.type;

                        if ($scope.prescription.type == 'reader') {
                            $scope.prescription.strength = $scope.prescription.value.data.strength;
                        } else if ($scope.prescription.method == 'calldoctor') {
                            $scope.prescription.calldoctor = $scope.prescription.value.data;
                        }else if ($scope.prescription.method == 'sendlater') {
                            console.log('Will send prescriptions later')
                        }

                        $rootScope.cart = response.cart;
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
            switch (type_method) {
                case 'reader':
                    if (!valid) return false

                    if ($scope.highIndexLine() != null) $scope.selectHighIndex(false);
                    data = {strength: $scope.prescription.strength}
                    save('reader', null, data, function () {
                        $scope.showPhaseA();
                    });

                    break;

                case 'calldoctor':
                    if (valid) {
                        data = $scope.prescription.calldoctor
                        save('prescription', 'calldoctor', data, function () {
                            $scope.anchorScroll('calldoctor');
                        });
                    }
                    break;

                case 'sendlater':
                    save('prescription', 'sendlater', '', function () {
                        $scope.anchorScroll('lensType');
                    })
                    break;

                case 'upload':
                    save('prescription', 'upload', $scope.prescription.upload, function () {
                        $scope.anchorScroll('lensType');
                    })
            }
        };

        $scope.uploadPrescription = function (files) {
            $scope.prescription.method = 'upload';
            $scope.progressbar = $scope.progressbar || ngProgressFactory.createInstance();
            $scope.progressbar.set(0);
            //$scope.progressbar.color('#00A2E1');

            var finished = false,
                extensions = ['jpg', 'jpeg', 'png', 'pdf'],
                maxSizeMB = 20; // 20MB

            if (files && files.length > 0) {
                if (extensions.indexOf(files[0].name.split('.').pop()) < 0) {
                    LoggerServices.error('Incorrect file format')
                } else if (files[0].size / (1024 * 1024) > maxSizeMB) {
                    LoggerServices.error('File size exceeded (max. ' + maxSizeMB + 'MB)')
                } else {
                    Upload.upload({
                        url: '/prescriptions/upload',
                        file: files[0]
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        if (!finished) $scope.progressbar.set(progressPercentage * 0.9);

                        $scope.log = 'progress: ' + progressPercentage + '% ' +
                            evt.config.file.name + '\n' + $scope.log;
                    }).success(function (data, status, headers, config) {
                        finished = true;
                        $scope.progressbar.complete();

                        LoggerServices.success("Prescription uploaded")
                        $scope.prescription.method = 'upload';

                        $scope.prescription.upload = data; // {new_filename, original_filename, file_size}
                        $scope.savePrescription('upload')
                        //$timeout(function () {
                        //    $scope.log = 'file: ' + config.file.name + ', Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                        //});
                    }).error(function (data, status, headers, config) {
                        console.log(status);
                        $scope.progressbar.reset();
                        // handle error
                    })
                }
            }
        }

        $scope.highIndexLine = function () {
            for (var i in $rootScope.cart.customLineItems) {
                var line = $rootScope.cart.customLineItems[i];
                if (line.slug == 'high-index-lens') {
                    return line;
                }
            }
            return null
        };

        $scope.blueBlockLine = function () {
            for (var i in $rootScope.cart.customLineItems) {
                var line = $rootScope.cart.customLineItems[i];
                if (line.slug == 'blue-block') {
                    return line;
                }
            }
            return null
        };



    }
])
;


angular.module('carts').directive('prescriptionBox', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/carts/templates/prescriptionBox.client.template.html',
        scope: false,
        transclude: true,
        replace: true,
        link: function ($scope, $element, $attrs) {
            // We don't want watches here!
            $element.find('.header').text($attrs.header);
            $element.css('width', Math.floor(100/$attrs.size - 1)+"%");
            $element.on('click', function(){
                $element.parent().find('.prescription-box').removeClass('selected');
                $element.addClass('selected');
            })
        }
    }
});

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

'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('Cart', ['$resource',
	function($resource) {
		return $resource('api/carts/:cartId', {
			cartId: '@_cartId'
		}
		, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', 'ipCookie', '$rootScope', 'Authentication', 'LoggerServices', 'Cart',
    function ($http, $q, ipCookie, $rootScope, Authentication, LoggerServices, Cart) {
        var urlString = '/api/carts';

        this.pageLoad = function () {

            $rootScope.loading = true;

            var customerId = null,
                cookieId = null;

            if (Authentication.user != null) {
                customerId = Authentication.user.id;
            }

            if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
                cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
            }

            this.init(customerId, cookieId).then(function (cart) {
                console.log('Cart ID: ' + cart.id);
                $rootScope.cart = cart;

                if(customerId == null) {
                    ipCookie('anonymousCart', $rootScope.cart.id, {path: '/'});
                    console.log('Cart saved in cookie.');
                }

                $rootScope.loading = false;
            });

        }

        this.addToCart = function (productId, variantId, channel, quantity) {

            var payload = {
                productId: productId,
                variantId: variantId,
                quantity: quantity,
                distributionChannel: channel
            }

            $rootScope.loading = true;

            this.addLineItem($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
                LoggerServices.success('Product added');
                $rootScope.cart = result;
                $rootScope.loading = false;
            }, function (error) {
                LoggerServices.error('Error while adding to Sphere Cart');
                $rootScope.loading = false;
            });

        }

        this.removeFromCart = function (item) {

            var payload = {
                lineItemId: item.id
            }

            $rootScope.loading = true;

            this.removeLineItem($rootScope.cart.id, $rootScope.cart.version, payload).then(function (result) {
                LoggerServices.success('Product removed');
                $rootScope.cart = result;
                $rootScope.loading = false;
            }, function (error) {
                LoggerServices.success('Error while removing to Sphere Cart. Restoring previous one.');
                $rootScope.loading = false;
            });

        }

        this.addLineItem = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addLineItem/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.removeLineItem = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeLineItem/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.byCustomer = function (customerId) {
            var deferred = $q.defer();

            $http.get(urlString + '/byCustomer/' + customerId).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setShippingAddress = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingAddress/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setBillingAddress = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setBillingAddress/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.setShippingMethod = function (cartId, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/setShippingMethod/' + cartId, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.changeLineItemQuantity = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/changeLineItemQuantity/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.addDiscountCode = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/addDiscountCode/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.addHighIndex = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/highIndex/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.removeHighIndex = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeHighIndex/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        // New code to add Blue Block Line Item

        this.addBlueBlock = function (cartId, version, payload) {
          var deferred = $q.defer();

          $http.post(urlString + '/blueBlock/' + cartId + '/' + version, payload).success(function (data){
            deferred.resolve(data);
          }).error(function (error){
            deferred.reject(error);
          });

          return deferred.promise;
        }

        this.removeBlueBlock = function (cartId, version, payload) {
            var deferred = $q.defer();

            $http.post(urlString + '/removeBlueBlock/' + cartId + '/' + version, payload).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.init = function (customerId, cookieId) {
            var deferred = $q.defer();

            var path = urlString + '/init';

            if(customerId) {
                path += '?customer=' + customerId;
            }

            if (cookieId) {
                if (customerId) {
                    path += '&cookie=' + cookieId;
                } else {
                    path += '?cookie=' + cookieId;
                }
            }

            $http.get(path).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.refreshCart = function (cookieId) {
            var deferred = $q.defer();

            var path = urlString + '/refreshCart?cookie=' + cookieId;
            $http.get(path).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        this.cartEyewearPrescriptionCount = function (cartId) {
            var deferred = $q.defer();
            var path = urlString + '/cartEyewearPrescriptionCount?cartId=' + cartId;
            $http.get(path).success(function (data) {
                deferred.resolve(parseInt (data));
            }).error(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

    }
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('OptileService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/optile';

        this.list = function (country, customer, payment) {
            var deferred = $q.defer();

            var payload = {
                "country": country,
                "customer": customer,
                "payment": payment
            };

            $http.post(urlString + '/list', payload).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);

'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('Prescriptions', ['$resource',
    function($resource) {
        return $resource('prescriptions/:cartId', { cartId: '@_id'
        }, {
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            },
            get: {
                method: 'GET'
            }
        });
    }
]);

'use strict';

//Products service used to communicate Products REST endpoints
angular.module('carts').factory('ShippingMethods', ['$resource',
	function($resource) {
		return $resource('shipping-methods/:shippingMethodId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('ShippingMethodService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/shipping-methods';

        this.byLocationOneCurrency = function (country, state, currency, zonename) {
            var deferred = $q.defer();

            var path = '',
                params = [];

            if (country)
                params.push('country=' + country);
            if (state)
                params.push('state=' + state);
            if (currency)
                params.push('currency=' + currency);
            if (zonename)
                params.push('zonename=' + zonename);

            for (var i = 0; i < params.length; i++) {
                if (i == 0)
                    path = '?' + params[i]
                else {
                    path += '&' + params[i]
                }
            }

            $http.get(urlString + '/byLocationOneCurrency' + path).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);

'use strict';

angular.module('carts').service('AddressSelector', [
    function () {

        this.dataCountries =  [

            {value:"US", label:"United States"}
        ];

        this.dataStates = {
            "US":[
                {
                    "code":"AL",
                    "name":"Alabama"
                },
                {
                    "code":"AK",
                    "name":"Alaska"
                },
                {
                    "code":"AS",
                    "name":"American Samoa"
                },
                {
                    "code":"AZ",
                    "name":"Arizona"
                },
                {
                    "code":"AR",
                    "name":"Arkansas"
                },
                {
                    "code":"AF",
                    "name":"Armed Forces Africa"
                },
                {
                    "code":"AA",
                    "name":"Armed Forces Americas"
                },
                {
                    "code":"AC",
                    "name":"Armed Forces Canada"
                },
                {
                    "code":"AE",
                    "name":"Armed Forces Europe"
                },
                {
                    "code":"AM",
                    "name":"Armed Forces Middle East"
                },
                {
                    "code":"AP",
                    "name":"Armed Forces Pacific"
                },
                {
                    "code":"CA",
                    "name":"California"
                },
                {
                    "code":"CO",
                    "name":"Colorado"
                },
                {
                    "code":"CT",
                    "name":"Connecticut"
                },
                {
                    "code":"DE",
                    "name":"Delaware"
                },
                {
                    "code":"DC",
                    "name":"District of Columbia"
                },
                {
                    "code":"FM",
                    "name":"Federated States Of Micronesia"
                },
                {
                    "code":"FL",
                    "name":"Florida"
                },
                {
                    "code":"GA",
                    "name":"Georgia"
                },
                {
                    "code":"GU",
                    "name":"Guam"
                },
                {
                    "code":"HI",
                    "name":"Hawaii"
                },
                {
                    "code":"ID",
                    "name":"Idaho"
                },
                {
                    "code":"IL",
                    "name":"Illinois"
                },
                {
                    "code":"IN",
                    "name":"Indiana"
                },
                {
                    "code":"IA",
                    "name":"Iowa"
                },
                {
                    "code":"KS",
                    "name":"Kansas"
                },
                {
                    "code":"KY",
                    "name":"Kentucky"
                },
                {
                    "code":"LA",
                    "name":"Louisiana"
                },
                {
                    "code":"ME",
                    "name":"Maine"
                },
                {
                    "code":"MH",
                    "name":"Marshall Islands"
                },
                {
                    "code":"MD",
                    "name":"Maryland"
                },
                {
                    "code":"MA",
                    "name":"Massachusetts"
                },
                {
                    "code":"MI",
                    "name":"Michigan"
                },
                {
                    "code":"MN",
                    "name":"Minnesota"
                },
                {
                    "code":"MS",
                    "name":"Mississippi"
                },
                {
                    "code":"MO",
                    "name":"Missouri"
                },
                {
                    "code":"MT",
                    "name":"Montana"
                },
                {
                    "code":"NE",
                    "name":"Nebraska"
                },
                {
                    "code":"NV",
                    "name":"Nevada"
                },
                {
                    "code":"NH",
                    "name":"New Hampshire"
                },
                {
                    "code":"NJ",
                    "name":"New Jersey"
                },
                {
                    "code":"NM",
                    "name":"New Mexico"
                },
                {
                    "code":"NY",
                    "name":"New York"
                },
                {
                    "code":"NC",
                    "name":"North Carolina"
                },
                {
                    "code":"ND",
                    "name":"North Dakota"
                },
                {
                    "code":"MP",
                    "name":"Northern Mariana Islands"
                },
                {
                    "code":"OH",
                    "name":"Ohio"
                },
                {
                    "code":"OK",
                    "name":"Oklahoma"
                },
                {
                    "code":"OR",
                    "name":"Oregon"
                },
                {
                    "code":"PW",
                    "name":"Palau"
                },
                {
                    "code":"PA",
                    "name":"Pennsylvania"
                },
                {
                    "code":"PR",
                    "name":"Puerto Rico"
                },
                {
                    "code":"RI",
                    "name":"Rhode Island"
                },
                {
                    "code":"SC",
                    "name":"South Carolina"
                },
                {
                    "code":"SD",
                    "name":"South Dakota"
                },
                {
                    "code":"TN",
                    "name":"Tennessee"
                },
                {
                    "code":"TX",
                    "name":"Texas"
                },
                {
                    "code":"UT",
                    "name":"Utah"
                },
                {
                    "code":"VT",
                    "name":"Vermont"
                },
                {
                    "code":"VI",
                    "name":"Virgin Islands"
                },
                {
                    "code":"VA",
                    "name":"Virginia"
                },
                {
                    "code":"WA",
                    "name":"Washington"
                },
                {
                    "code":"WV",
                    "name":"West Virginia"
                },
                {
                    "code":"WI",
                    "name":"Wisconsin"
                },
                {
                    "code":"WY",
                    "name":"Wyoming"
                }
            ]};

    }
]);

'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
	function($stateProvider, $urlRouterProvider,$locationProvider) {
		// Redirect to home view when route not found
		if(window.location.search && window.location.search.match(/\?_escaped_fragment_/i)){
			// Bot crawling website
		}else
			$urlRouterProvider.otherwise('/');

		$locationProvider.html5Mode(true);

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		}).
		state('landingSummer', {
			url: '/landing/summer/:gender',
			templateUrl: 'modules/core/views/landing-summer.client.view.html'
		});
	}
]);

'use strict';

angular.module('core').controller('FooterController', ['$scope', 'Authentication', 'LoggerServices', '$http',
    function($scope, Authentication, LoggerServices, $http) {
        $scope.authentication = Authentication;

        $scope.subscribeToNewsletter = function(){
            // TODO prevent abuse
            var list = 'newsletter';
            var urlString = '/api/subscribe/'+list;
            var params = {email: $scope.newsletter.email}
            $http.post(urlString, params).success(function(result){
                var status = (result.toLowerCase() === 'true');
                if(status) {
                    LoggerServices.success("An email has been sent to you to complete the subscription");
                    $scope.newsletter = {}
                }else
                    LoggerServices.error("There was an error subscribing, please try again.")
            }).error(function(e){
                LoggerServices.error(e.error)
            });
        }

    }
]);

'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus', 'CartService', 'CustomerService', '$location','$rootScope','$http','$window','ipCookie',
	function($scope, Authentication, Menus, CartService, CustomerService, $location,$rootScope,$http,$window,ipCookie) {
		$scope.authentication = Authentication;

		$scope.removeFromCart = function (item) {
			CartService.removeFromCart(item);
		};

		$scope.proceedToCheckout = function () {
			if ($rootScope.cart != null && $rootScope.cart.lineItems != null && $rootScope.cart.lineItems.length > 0) {
				var cookieId = null;
				if (ipCookie('anonymousCart', undefined, {path: '/'}) != null) {
					cookieId = ipCookie('anonymousCart', undefined, {path: '/'});
				}
				if (!Authentication.user && cookieId) {
					CartService.refreshCart(cookieId).then(function (cart) {
						$rootScope.cart = cart;
						$location.path('/checkout');
					});
				}
				else {
					$location.path('/checkout');
				}
			}
		}

		$scope.signout = function () {
			$http.get('/api/auth/signout').success(function (result) {
				$rootScope.cart = result;
				$window.location = '/';


			}).error(function (error) {
				console.log(error)
			});
		}

		$scope.search = function(text){
			$location.path('text/' + text);
		}

	}
]);

'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'ContentfulService', '$stateParams', 'LoggerServices','$sce',
	function($scope, Authentication, ContentfulService, $stateParams, LoggerServices,$sce) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.lang = 'en';

		$scope.trustAsHtml = function (string) {
			return $sce.trustAsHtml(string);
		};

		if ($stateParams.hasOwnProperty('gender')) {
			$scope.gender = $stateParams.gender;
		}

		if ($stateParams.hasOwnProperty('slug')){
			$scope.category = $stateParams.slug
		}

		$scope.loadContent = function(page, args){
			console.log('Loading contentful data: '+page+'('+(args?args:'')+')')
			ContentfulService[page](args).then(function(data) {
				console.log('Contentful page loaded.')
				$scope.contentfulData = data;
			});
		}

	}
]);

angular.module('core').directive('hero', function () {
    return {
        link: function (scope, element, attrs) {
            $(element).unslider({
                speed: 800,               //  The speed to animate each slide (in milliseconds)
                delay: 4000,              //  The delay between slide animations (in milliseconds)
                dots: true,               //  Display dot navigation
                fluid: true              //  Support responsive design. May break non-responsive designs
            });
        }
    }
});

angular.module('core').directive('cartFadeInClass', ['$detection', function ($detection) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var mobile = $detection.isAndroid() || $detection.isiOS() || $detection.isWindowsPhone() || $detection.isBB10();
            if (!mobile) {
                $(element).mouseover(function () {
                    //$('.cart-preview').fadeIn().removeClass('hidden');
                    $(element.parent().children()[1]).fadeIn().removeClass('hidden');
                });
            }


        }
    }
}]);

angular.module('core').directive('cartFadeOutClass', ['$detection', function ($detection) {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            var mobile = $detection.isAndroid() || $detection.isiOS() || $detection.isWindowsPhone() || $detection.isBB10();
            if (!mobile) {
                $(element).mouseleave(function () {
                    $(element).fadeOut().addClass('hidden');
                });
            }

        }
    }
}]);

angular.module('core').directive('priceRange', function () {
    return {
        link: function (scope, element, attrs) {

            $(element).noUiSlider({
                start: [0, 500],
                connect: true,
                range: {
                    'min': 0,
                    'max': 500
                }
            });

            $(element).Link('lower').to($('#range-number-min'), null, wNumb({
                decimals: 0
            }));
            $(element).Link('upper').to($('#range-number-max'), null, wNumb({
                decimals: 0
            }));

        }
    }
});

angular.module('core').directive('uicheckbox', function () {
    return {
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $(this).parent('label').toggleClass('checked');
            })
        }
    }
});

angular.module('core').directive('thumbnailWrapper', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $(element).removeClass('active');
                var url = $(this).data('url');
                $('.img-big img').fadeOut();
                setTimeout(function(){
                    $('.img-big img').attr('src', url);
                    $('.img-big img').fadeIn();

                },500);
                $(this).addClass('active');
                return false;
            });
        }
    }
});


angular.module('core').directive('panelLoader', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                $('.select').removeClass('active');
                $(element).parent('.select').addClass('active');
                var target = $(this).data('target');
                if(target)
                    $('.product-panels').load('modules/products/views/content-panels/' + target + '.client.view.html');
                return false;
            });
        }
    }
});

angular.module('core').directive('panelTrigger', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {
                if($(this).parents('.ex-panel').attr('class').indexOf('disabled') == -1) {
                    $(this).parents('.ex-panel').toggleClass('active');
                }
                return false;
            });
        }
    }
});


angular.module('core').directive('blockRadio', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {

            $(element).click(function() {

                var radios = $(this).parent().children();

                for(var i = 0; i < radios.length; i++) {
                    $(radios[i]).removeClass('checked');
                }

                $(this).addClass('checked');
            });
        }
    }
});

angular.module('core').directive('error', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).focus(function() {
                $(this).removeClass('error');
            });
        }
    }
});

angular.module('core').directive('select', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attrs) {
            $(element).on('change', function() {
                $(this).addClass('active');
            });

        }
    }
});

angular.module('core').directive('tab', function () {
    return {
        restrict: 'C',
        link: function (scope, element, attrs) {
            $(element).click(function() {
                var target = $(this).data('tab');
                var openthis = '#' + target;
                $('.tab').removeClass('active');
                $('.tab-content').removeClass('active');
                $(openthis).addClass('active');
                $(element).addClass('active');
                return false;
            });

        }
    }
});

angular.module('core').directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                } else {
                    attrs.$set('src','/design/images/noimage.jpg');
                }
            });
        }
    }
});

angular.module('core').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

angular.module('core').directive('scrollTop', function() {
    return {
        restrict: 'A',
        link: function() {
            window.scrollTo(0,0);
        }
    }
});


angular.module('core').directive('addthisToolbox', ['$timeout','$location','$rootScope', function($timeout,$location,$rootScope) {
    return {
        restrict : 'A',
        transclude : true,
        replace : true,
        template : '<div ng-transclude></div>',
        link : function($scope, element, attrs) {
            addthis.init();
            setTimeout(function () {
                addthis.toolbox($(element).get(), {}, {
                    url:$location.absUrl(),
                    title : $rootScope.productShare? $rootScope.productShare.name.en:"",
                    description : $rootScope.productShare? $rootScope.productShare.description.en:""
                });
            },4000);
        }
    };
}]);

'use strict';

var LOCALE = 'en';

angular.module('core').filter('locale', ["appDefaults", function(appDefaults){
    return function(input){
        var locale = appDefaults.locale || LOCALE;
        if(input)
            return input[locale];
        else
            return ''
    }
}])

angular.module('core').filter('priceTimes', function(){
    return function(price, times){
        if(price.value){
            price = price.value
        }
        var totalLinePrice = angular.copy(price);
        totalLinePrice.centAmount = totalLinePrice.centAmount * times;
        return totalLinePrice
    }
})

angular.module('core').filter('sumDiscounts', function(){
    return function(includedDiscounts){
        var totalLineDiscount = {
            currencyCode: includedDiscounts[0].discountedAmount.currencyCode,
            centAmount: 0,
        };
        for(var i in includedDiscounts){
            totalLineDiscount.centAmount += includedDiscounts[i].discountedAmount.centAmount
        }
        return {value: totalLineDiscount}
    }
});

angular.module('core').filter('priceMath', function(){
    return function(firstPrice, secondPrice, op){
        var price = angular.copy(firstPrice);
        switch(op){
            case '+':
                price.centAmount += secondPrice.centAmount;
                break;
            case '-':
                price.centAmount -= secondPrice.centAmount;
                break;
        }

        return price
    }
})

angular.module('core').filter('range', function() {
    return function(input, min, max) {
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
            input.push(i);
        return input;
    };
});

angular.module('core').filter('size', function () {
    return function (input, size) {

        if (input) {

            var dotIndex = input.lastIndexOf('.'),
                fileName = input.substring(0, dotIndex),
                fileExtention = input.substring(dotIndex, input.length);

            input = fileName + '-' + size + fileExtention;

        }
        return input;
    };
});

'use strict';
/**
 * Override Angular's built in exception handler, and tell it to
 * use our new exceptionLoggingService which is defined below
 */
angular.module('core').provider(
    "$exceptionHandler", {
        $get: ["exceptionLoggingService", function (exceptionLoggingService) {
            return (exceptionLoggingService);
        }]
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

'use strict';
angular.module('core').factory('HeadDataService', ['$http',
    function ($http) {
        var headData = null;
        $http.get('/api/config').success(function (data) {
            headData = data;
        });

        return {
            headData: function () {
                return headData;
            }
        };
    }
]);

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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar', true);
	}
]);
'use strict';

// Config HTTP Error Handling
angular.module('customers').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('customers').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('login', {
                url: '/login',
                templateUrl: 'modules/customers/views/login.client.view.html'
            }).
            state('account', {
                url: '/account',
                templateUrl: 'modules/customers/views/account.client.view.html'
            }).
            state('account-new', {
                url: '/account-new',
                templateUrl: 'modules/customers/views/account-new.client.view.html'
            }).
            state('edit-address', {
                url: '/edit-address/:id',
                templateUrl: 'modules/customers/views/my-account/edit-address.client.view.html'
            }).
            state('my-addresses', {
                url: '/my-addresses',
                templateUrl: 'modules/customers/views/my-account/my-addresses.client.view.html'
            }).
            state('my-orders', {
                url: '/my-orders',
                templateUrl: 'modules/customers/views/my-account/my-orders.client.view.html'
            }).
            state('order-details', {
                url: '/order-details',
                templateUrl: 'modules/customers/views/my-account/order-details.client.view.html'
            }).
            state('reset-password', {
                url: '/password/reset/:token',
                templateUrl: 'modules/customers/views/reset-password.client.view.html'
            });
    }
]);

'use strict';

angular.module('customers').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$rootScope', 'CustomerService', 'LoggerServices',
	function($scope, $http, $location, Authentication, $rootScope, CustomerService, LoggerServices) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.register = function() {
			var createValues = {
                firstName: $scope.register.firstName,
                lastName: $scope.register.lastName,
                email: $scope.register.email,
                password: $scope.register.password
			}

			$http.post('/api/auth/signup', createValues).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('#!/account');
				$scope.register = {}
				LoggerServices.success("Registered successfully")
			}).error(function(response) {
				LoggerServices.error(response.message);
				$scope.register.password = null;
			});
		};

		$scope.signin = function() {
			$rootScope.loading = true;
			$scope.credentials.anonymousCartId = $rootScope.cart.id;

			$http.post('/api/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response.customer;
				$rootScope.cart = response.cart;
				console.log('Cart from Sphere after login. ID: ' + $rootScope.cart.id);
				if(response.hasOwnProperty('remember')){
					CustomerService.setCookie(response.remember.rem, response.remember.rid)
				}

				$scope.credentials = {};

				// And redirect to the index page
				$location.path('/');
				$rootScope.loading = false;
				LoggerServices.success("Logged in successfully")
			}).error(function(response) {
				LoggerServices.error(response.message)
				$rootScope.loading = false;
			});
		};

		$scope.requestPasswordReset = function(){
			$scope.reset_result = null;

			$http.post('/api/customers/password-token', $scope.reset).success(function(response){
				$scope.reset_result = {
					status: "success",
					message: "An email has been sent to reset the password"
				}
				$scope.reset = {}
			}).error(function(error){
				$scope.reset_result = {
					status: "error",
					message: error.message
				}				
			})
		}
	}
]);

'use strict';

angular.module('customers').controller('CustomerController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);

'use strict';

angular.module('customers').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');


		$scope.resetPassword = function(){
			$scope.reset_result = null;

			var payload = {
				token: $stateParams.token,
				password: $scope.reset.password
			}

			// Make sure the passwords match
			if($scope.reset.password != $scope.reset.repeatPassword){
				$scope.reset = {};
				$scope.reset_result = {
					status: "error",
					message: "Password do not match"
				}
				return false;
			}

			// Request password to be updated
			$http.post('/api/customers/password/reset', payload).success(function(response){
				$scope.reset = {};
				// Authentication.user = response;

				$scope.reset_result = {
					status: "success",
					message: "Password reset successful"
				}
			}).error(function(response) {
				$scope.reset_result = {
					status: "error",
					message: response.message
				}
			});
		}

		
		$scope.cancel = function(){
			$location.path('/')
		}
		$scope.goToLogin = function(){
			$location.path('/login')
		}
	}
]);

'use strict';

angular.module('customers').controller('ProfileController', ['$scope', '$http', '$stateParams', '$location', 'Customers', 'Authentication', 'Addresses', 'updateStatus', 'LoggerServices','AddressSelector',
	function($scope, $http, $stateParams, $location, Customers, Authentication, Addresses, updateStatus, LoggerServices,AddressSelector) {
    $scope.dataStates = AddressSelector.dataStates;
    $scope.customer = angular.copy(Authentication.user);


		// If user is not signed in then redirect back home
		if (!$scope.customer) $location.path('/');

		// Update a user profile
		$scope.updateCustomerProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var customer = new Customers($scope.customer);

				customer.$update(function(response) {
					$scope.success = "Profile updated successfully.";
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeCustomerPassword = function() {
			$scope.success = $scope.error = null;

			if($scope.password.newPassword != $scope.password.repeatPassword){
				LoggerServices.error("The new passwords don't match")
				return
			}

			$http.put('/api/customers/password/update', $scope.password).success(function(response) {
				LoggerServices.success(response.message);
				$scope.password = {}
			}).error(function(response) {
				LoggerServices.error(response.message);
			});
		};

		/*
		 * Addresses
		 */

		$scope.addCustomerAddress = function(form){
			if(form.$valid){
				$scope.success = $scope.error = null;
				var address = new Addresses($scope.newAddress);

				address.$save(function(response) {
					$scope.success = true;
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);
					$scope.newAddress = {};

					$scope.addAddressError = null;
					$scope.addAddressSuccess = "Address added successfully"
					updateStatus = {}

					form.$setPristine();
				}, function(error) {
					$scope.addAddressError = error.data.message;
				});
			}else{
				$scope.submitted = true;
			}
		};

		$scope.deleteAddress = function(address){
			if(address){
				$scope.success = $scope.error = null;
				var address = new Addresses(address);

				address.$delete(function(response){
					$scope.success = true;
					Authentication.user = response;
					$scope.customer = angular.copy(Authentication.user);

					$scope.addAddressError = null;
					$scope.addAddressSuccess = "Address deleted successfully"
					updateStatus = {}
				}, function(error) {
					$scope.addAddressError = error.data.message;
				});
			}else{
				console.log("No address to delete.")
				return false;
			}
		}

		$scope.editAddress = function(address){
			if(address){
				$location.path('/edit-address/'+address.id);
			}
		}

		$scope.updateCustomerAddress = function(form){
			if(form.$valid){
				var address = new Addresses($scope.editAddress)

				address.$update(function(response){
					Authentication.user = response;
					$location.path('/my-addresses');
					updateStatus.message = "Address updated successfully";
				}, function(error){
					$scope.updateError = "Error updating the address"
				});				
			}
		}

		$scope.fetchOwnAddressPerId = function(){
			var id = $stateParams.id

			var addresses = $scope.customer.addresses
			for(var i = 0; i < addresses.length; i++){
				if(addresses[i].id == id){
					return addresses[i]
				}
			}

			// If no address is found´
			$scope.error = "Address not found"
		}

		$scope.defaultAddress = function(){
			$scope.newAddress = {}
			$scope.newAddress.country = ''
		}

		$scope.getUpdateStatus = function(){
			return updateStatus;
		}

		/*
		 * Newsletter subscription
		 */

		$scope.fetchSubscription = function(list){
			$http.get('/api/issubscribed/'+list).success(function(result){
				$scope[list+"Subscription"] = (result.toLowerCase() === 'true')
			})
		};

		$scope.updateSubscription = function(list){
			// TODO prevent abuse
			var urlString = ($scope[list+"Subscription"] ? '/api/unsubscribe/'+list : '/api/subscribe/'+list);
			var params;
			$http.post(urlString, params).success(function(result){
				var status = (result.toLowerCase() === 'true');
				$scope.error = ""
				if(status)
					$scope.success = "An email has been sent to you to complete the subscription"
				else
					$scope.success = "Unsubscribed successfully"

				$scope[list+"Subscription"] = status;
			}).error(function(e){
				$scope.success = null
				$scope.error = e.error
				$scope[list+"Subscription"] = false;
			})
		};

		/*
		 * Order History
		 */

		$scope.fetchOrders = function(){
			$scope.orders = []
			$http.get('/api/orders/own').success(function(result){
				console.log(result)
				$scope.orders = result;
			})
			.error(function(error){
				console.log(error)
			})
		}
	}
]);

'use strict';

angular.module('customers').filter('totalItems', function () {
  return function(lineItems){
		var count = 0;

		lineItems.forEach(function(line){
			count = count + line.quantity;
		})

		return count;
  }	
})
.filter('statusColor', function(){
	return function(status){
		var color;

		switch(status){
			case "Paid":
				color = "green";
				break;
			case "Open":
				color = "yellow";
				break;
			case "Complete":
				color = "green";
				break;
			case "Cancelled":
				color = "red";
				break;
		}

		return color;
	}
})

'use strict';

// Users service used for communicating with the users REST endpoint
var module = angular.module('customers')

module.factory('Addresses', ['$resource',
  function($resource) {
    return $resource('api/addresses/:id', {id: "@id"}, {
      save: {
        method: 'POST',
        params: {id: ''}
      },
      update: {
        method: 'PUT'
      },
      delete: {
        method: 'DELETE'
      },
      get: {
        method: 'GET'
      }
    });
  }
])

// Persistance on update address status when changing route
.factory('updateStatus', function(){
  var status;

  status = status || {}
  return status
})

'use strict';

// Authentication service for user variables
angular.module('customers').factory('Authentication', ['$window',
	function ($window) {
		var auth = {
			user: $window.user !== "" ? window.user : null
		};

		return auth;
	}
]);

'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('customers').factory('Customers', ['$resource',
	function($resource) {
		return $resource('api/customers', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
])

.factory('CustomerService', ['$http', 'ipCookie', '$rootScope', 'Authentication',
	function($http, ipCookie, $rootScope, Authentication){
        var funs = {
			setCookie: function(value, rid){
				ipCookie('rem', value, {expires: 21})
                ipCookie('rid', rid, {expires: 21})
			},
			checkCookieAndLogin: function(){
                var funs = this;

				if(!Authentication.user && ipCookie('rem')){
					console.log('Requesting login from cookie')

					var payload = {
						rem: ipCookie('rem'),
						rid: ipCookie('rid')
					}

                    // Add login loader?
					$http.post('/api/auth/token', payload).success(function(response) {
						// If successful we assign the response to the global user model
						Authentication.user = response.customer;
						$rootScope.cart = response.cart;
					}).error(function(error) {
						console.log('Could not login from cookie')
                        funs.removeCookie()
					});
				}
			},
			/*removeCookie: function(){
				console.log("Remove cookie");
				ipCookie.remove('rem');
                ipCookie.remove('rid');
			}*/
		}
        return funs;
	}
])

'use strict';

//Setting up route
angular.module('misc').config(['$stateProvider',
    function ($stateProvider) {

        $stateProvider.
            state('locations', {
                url: '/locations',
                templateUrl: 'modules/misc/views/locations.client.view.html'
            }).
            state('about-us', {
                url: '/about-us',
                templateUrl: 'modules/misc/views/about-us.client.view.html'
            }).
            state('support', {
                url: '/support',
                templateUrl: 'modules/misc/views/help.client.view.html'
            }).
            state('privacy', {
            url: '/privacy',
            templateUrl: 'modules/misc/views/privacy.client.view.html'
            }).
            state('terms-of-use', {
                url: '/terms-of-use',
                templateUrl: 'modules/misc/views/terms-of-use.client.view.html'
            });
    }
]);

'use strict';

angular.module('misc').controller('AboutUsController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('aboutUsPage','About Us').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);

'use strict';

angular.module('misc').controller('ContactusController', ['$scope', 'Authentication', '$http',
    function ($scope, Authentication, $http) {
        $scope.authentication = Authentication;

        if($scope.authentication && $scope.authentication.user != null){
            $scope.contactUs = {}
            $scope.contactUs.email = $scope.authentication.user.email,
                $scope.contactUs.name = $scope.authentication.user.name
        }

        $scope.contactUsSubmit = function(valid){
            if(!valid){
                $scope.contactError = "Please fill in all the required fields"
                return;
            }

            var post_body = {
                name: $scope.contactUs.name,
                email: $scope.contactUs.email,
                message: $scope.contactUs.message
            }

            $http.post('/api/contactUs', post_body).success(function(result){
                $scope.contactSuccess = $scope.contactError = null;

                if(result.status == "sent"){
                    $scope.contactSuccess = "Message sent successfully. We'll get back to you as soon as possible!"

                    $scope.contactUs.message = ""
                }else{
                    $scope.contactError = "There was an error sending the email, please try again"
                }
            }).error(function(error){
                $scope.contactError = "We seem to be having troubles on our end, please try again later"
            })

        }
    }
]);

'use strict';

angular.module('misc').controller('HelpController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(page, args){
            console.log('Loading contentful data: '+page+'('+(args?args:'')+')')
            ContentfulService[page](args).then(function(data) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = data;
            });
        }
    }
]);

'use strict';

angular.module('misc').controller('LocationsController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    $scope.authentication = Authentication;

  }
]);

'use strict';

angular.module('misc').controller('PrivacyController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('miscPage','Privacy Page').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);

'use strict';

angular.module('misc').controller('TermsOfUseController', ['$scope', 'Authentication','ContentfulService','$sce',
    function ($scope, Authentication,ContentfulService,$sce) {
        $scope.authentication = Authentication;

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.loadContent = function(){
            ContentfulService['byTypeAndName']('miscPage','Terms of Use').then(function(result) {
                console.log('Contentful page loaded.')
                $scope.contentfulData = result.data;
            });
        }
    }
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('ContentfulService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/contentful';

        this.home = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/home').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.eyewear = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/category/eyewear/' + gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.sunglasses = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/category/sunglasses/' + gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.summer = function (gender) {
            var deferred = $q.defer();

            $http.get(urlString + '/summer/'+gender).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        this.help = function () {
            var deferred = $q.defer();

            $http.get(urlString + '/help').success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }


        this.byTypeAndName = function (type, name) {
            return $http.get(urlString + '/byTypeAndName', {
                params: {
                    type: type,
                    name: name
                }
            });
        }
    }
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('misc').service('CustomObjectService', ['$http', '$q',
    function ($http, $q) {
        var urlString = '/custom-objects';

        this.find = function (container, key) {
            var deferred = $q.defer();

            $http.get(urlString + '/find?container=' + container + '&key=' + key).success(function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

    }
]);

'use strict';

//Setting up route
angular.module('orders').config(['$stateProvider',
    function ($stateProvider) {
        // Products state routing
        $stateProvider.
            state('orders', {
                url: '/orders',
                templateUrl: 'modules/orders/views/orders.client.view.html'
            }).
            state('view-order', {
                url: '/orders/:orderId',
                templateUrl: 'modules/orders/views/view-order.client.view.html'
            }).
            state('order-view', {
                url: '/order-view',
                templateUrl: 'modules/orders/views/view-order.client.view.html'
            })

        ;
    }
]);

'use strict';

angular.module('orders').controller('OrdersController', ['$scope', 'Authentication', 'Order', '$stateParams',
    function ($scope, Authentication, Order, $stateParams) {
        $scope.authentication = Authentication;

        $scope.findOne = function () {
            var id = null;

            if ($stateParams.orderId == null) {
                id = $stateParams.orderId;
            } else {
                id = $stateParams.orderId;
            }

            Order.get({
                orderId: id
            }, function (data) {
                $scope.paymentInfo = data.paymentInfo.payments [0].obj.paymentMethodInfo.method;
                $scope.order = data;
            });


        }

    }
]);

'use strict';

angular.module('orders').factory('Order', ['$resource',
	function($resource) {
		return $resource('api/orders/:orderId', { productId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('orders').service('OrderService', ['$http', '$q', '$location', '$window',
    function ($http, $q, $location, $window) {
        var urlString = '/api/orders';


    }
]);

'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
    function ($stateProvider) {
    // Products state routing
    $stateProvider.

        state('viewProduct', {
          url: '/products/:id',
          templateUrl: 'modules/products/views/product-detail.client.view.html'
        }).

        /*
         * Categories
         */

        // General
        state('categoryProducts',{
          url: '/categories/:slug',
          templateUrl: 'modules/products/views/category-home.client.view.html'
        }).
        state('categoryGenderProducts',{
          url: '/categories/:gender/:slug',
          templateUrl: 'modules/products/views/category-products.client.view.html'
        }).
        state('searchByText',{
            url: '/text/:text',
            templateUrl: 'modules/products/views/category-products.client.view.html'
        });
  }
]);


'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope','$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ContentfulService', 'LoggerServices', 'lodash','$sce',
    function ($scope, $rootScope,$stateParams, $location, Authentication, Products, ProductService, CartService, ContentfulService, LoggerServices, _,$sce) {
        $scope.authentication = Authentication;
        $scope.$location = $location;
        $scope.productFiltersMin = 0;
        $scope.productFiltersMax = 500;
        $scope.pageSize = 25;
        $scope.pageNum = 1;
        $scope.productFilters = {};
        $scope.selectedFilters = {};
        $scope.priceRange = $scope.productFiltersMin + "-" + $scope.productFiltersMax;
        $scope.selectedOptionFilter = "ALL";
        $scope.colorMapping = {
            "GOLD": ["GOLD","BLACK/GOLD"],
            "SILVER": ["SILVER","GUNMETAL"],
            "RED": ["RED","RED/TORTOISE","RED/BLACK","RED/GREY FADE","BLACK/RED","BLUE/RED/WHITE","ROSE"],
            "BLUE": ["BLUE","DARK BLUE","BLUE/TEAL","BLACK/BLUE","BLUE/BLACK","BLUE/GREY","BLUE/TORTOISE","BLUE/GRAY","BLUE/WHITE MARBLE","BLUE/RED/WHITE"],
            "BLACK": ["BLACK","BLACK/BLUE","BLACK/CLEAR","BLACK ONYX FADE", "RED/BLACK","BLACK/GRAY","BLUE/BLACK","BLACK/GOLD","BLACK/RED","BLACK/WHITE MARBLE","BLACK/GREY MARBLE","BLACK/GRAY MARBLE","BLACK/GRAY TORTOISE SHELL"],
            "BROWN": ["BROWN","COPPER BRINDLE","BROWN/TAN","PINK/BROWN","DARK BROWN","BROWN TORTOISE SHELL","MAHOGANY/BROWN","TORTISE SHELL BROWN","BROWN/AQUA","BRONZE","GREEN/BROWN","GREEN/BROWN FADE","BROWN/CLEAR","BROWN TORTOISE SHELL/PINK"],
            "GREEN": ["GREEN","LIGHT GREEN","MILITARY GREEN","GREEN/TORTOISE","GREEN/BROWN","GREEN/BROWN FADE"],
            "GRAY": ["GREY","GREY (OLIVE)","GRAY FADE","GRAY/CLEAR","GRAY","GRAY (OLIVE)","GRANITE GRAY","GREY/DRIFTWOOD","GRAY/DRIFTWOOD","BLACK/GRAY","BLUE/GREY","BLUE/GRAY","RED/GREY FADE","BLACK/GREY MARBLE","BLACK/GRAY MARBLE","BLACK/GRAY TORTOISE SHELL"],
            "PURPLE": ["BLACK/PURPLE"],
            "WHITE": ["BLONDE TORTOISE SHELL","BLUE/WHITE MARBLE","BLACK/WHITE MARBLE","BLUE/RED/WHITE","FROSTED CLEAR/WHITE"],
            "TORTOISE": ["BLONDE TORTOISE SHELL","BLUE/TORTOISE","BROWN TORTOISE SHELL","TORTOISE","MARBLED COPPER","BROWN TORTOISE SHELL/PINK"]
        };
        $scope.widthMapping = {
            "SMALL": ["SMALL","SMALL/MEDIUM"],
            "MEDIUM": ["MEDIUM","SMALL/MEDIUM","MEDIUM/LARGE"],
            "LARGE": ["LARGE","MEDIUM/LARGE"]
        }
        $scope.sortAttributes = [
            { name: 'name', sortAttr: 'name.en', sortAsc: true },
            { name: 'price', sortAttr: 'price', sortAsc: true}];
        $scope.selectedSort = $scope.sortAttributes[0];


        $scope.FETCHING = false; // Will keep track of fetches
        $scope.lang = 'en';
        $scope.currency = 'USD';
        $scope.error = {}

        $scope.facetConfig = {
            'lensColor': {
                'title': 'Lens Color'
            },
            'frameColor': {
                'title': 'Frame Color'
            },
            'width': {
                'title': 'Frame Width'
            },
            'frameShape': {
                'title': 'Frame Shape'
            },
            'frameMaterial': {
                'title': 'Frame Material'
            },

        }
        $scope.currentFilters = {};
        $scope.isAvailable = false;
        $scope.product = {};

        var processFilters = function () {

            _.each(_.keys ($scope.facetConfig),function (filter) {
                if ($scope.selectedFilters[filter]) {
                    $scope.productFilters[filter] = _.keys ($scope.selectedFilters[filter]);
                }
            });
            if ($scope.selectedFilters["width"]) {
                var values = _.uniq(_.flatten(_.map(_.keys($scope.selectedFilters['width']), function (item) {
                    return $scope.widthMapping [item];
                })));
                $scope.productFilters['width'] = values;

            }
            if ($scope.selectedFilters["frameColor"]) {
                var values = _.uniq(_.flatten(_.map(_.keys($scope.selectedFilters['frameColor']), function (item) {
                    return $scope.colorMapping [item];
                })));
                $scope.productFilters['frameColor'] = values;

            }
        };

        var mapFacets = function (facets) {
            if (facets['width']) {
                var result = _.map(facets["width"], function (item) {
                    return _.filter(_.keys($scope.widthMapping), function (elem) {
                        return item.term.indexOf(elem) != -1;
                    });
                });
                facets['width'] = _.map(_.uniq(_.flatten(result)), function (item) {
                    return {term: item}
                });


            }
            if (facets['frameColor']) {
                var result = _.map (_.keys($scope.colorMapping),function (key) {
                    var match =_.find ($scope.colorMapping[key], function (mappingColors) {
                       return !_.isUndefined(_.find (facets['frameColor'],function (facetColor){
                            return mappingColors == facetColor.term;
                        }));
                    })
                    if (!_.isUndefined (match)) {
                        return key;
                    }
                    return undefined;
                });
                facets['frameColor'] = _.map(_.compact(result), function (item) {
                    return {term: item}
                });


            }
            //order facets
            facets  = _.reduce(_.keys (facets),function (result,key) {
                result [key] = _.sortBy(facets [key], 'term');
                return result;
            },{});
            return facets;
        }
        $scope.find = function () {

           if ($stateParams.gender) {
                $scope.gender = $stateParams.gender;
               processFilters ();

                // Both genders will includoe unisex products
               $scope.productFilters.gender = ["UNISEX"];
               $scope.productFilters.gender.push ($scope.gender.toUpperCase());
               if ($scope.gender.toUpperCase() == "MEN") {
                   $scope.productFilters.gender.push ("Mens");
               }
               else if ($scope.gender.toUpperCase() == "WOMEN") {
                   $scope.productFilters.gender.push ("Womens");
               }

            }

            var minPrice = Math.ceil($scope.productFiltersMin) * 100;
            var maxPrice = Math.ceil($scope.productFiltersMax) * 100;
            $scope.productFilters.price = {
                value: "range (" + minPrice + " to " + maxPrice + ")",
                isText: false
            };
            // Get category slug
            $scope.category = $stateParams.slug;
            //categoryB is not used
            $stateParams.categoryB = undefined;
            $scope.pageTitle = $scope.gender ? $scope.gender + "'s " + $scope.category : $scope.category;


            ProductService.listBy($scope.category, $stateParams.categoryB, $scope.productFilters, $scope.pageNum, $scope.pageSize, $scope.selectedSort.sortAttr, $scope.selectedSort.sortAsc).then(function (results) {
                $scope.results = results.data;
                $scope.categoryInfo = $scope.results.categories[0];
                if ($scope.categoryInfo.metaTitle) {
                    $('title').text($scope.categoryInfo.metaTitle.en);
                }
                if ($scope.categoryInfo.metaDescription) {
                    $('meta[name=description]').attr('content', $scope.categoryInfo.metaDescription.en);
                }
                $scope.products = results.data.products;
                $scope.facets = mapFacets(results.data.facets);

                $scope.pageSize = results.data.pages.perPage || $scope.pageSize;
                $scope.pageNum = results.data.pages.current || $scope.pageNum;
                $scope.totalPages = results.data.pages.total;

                // For ng-repeat
                $scope.pageRange = new Array($scope.totalPages);


            })
        };

        $scope.init = function () {
           if ($stateParams.slug) {
               $scope.loadContent($stateParams.gender,$stateParams.slug);
               $scope.find();
            } else {
                $scope.search();
            }

        }

        $scope.loadContent = function(gender, slug){
            ContentfulService[slug](gender).then(function(data) {
                $scope.contentfulData = data;
            });
        }

        $scope.optionFilter = function (value) {
            if (value) {
                if (value == "PRESCRIPTION") {
                    $scope.selectedOptionFilter = "PRESCRIPTION";
                    $scope.productFilters['options'] = ["PROGRESSIVE","SINGLEVISION"];
                }
                if (value == "FRAMES") {
                    $scope.selectedOptionFilter = "FRAMES";
                    $scope.productFilters['options'] = "NONPRESCRIPTION";
                }


            } else {
                $scope.selectedOptionFilter = "ALL";
                delete $scope.productFilters['options'];
            }
            $scope.init();
        }

        $scope.search = function () {
            var text = $stateParams.text;
            processFilters ();
            $scope.category = 'Search';
            $scope.pageTitle = 'Search';
            if ($stateParams.gender) {
                $scope.gender = $stateParams.gender;

                // Both genders will include unisex products
                $scope.productFilters.gender = {};
                var genderAlias;
                if ($scope.gender.toUpperCase() == "MEN") {
                    genderAlias ="Mens";
                }
                else if ($scope.gender.toUpperCase() == "WOMEN") {
                    genderAlias = "Womens";
                }
                $scope.productFilters.gender =  {
                    value: "\"UNISEX\",\""+$scope.gender.toUpperCase()+"\",\""+genderAlias+"\"",
                    isText: false
                };
            }


            ProductService.search(text, $scope.productFilters, $scope.pageNum, $scope.pageSize, $scope.selectedSort.sortAttr, $scope.selectedSort.sortAsc).then(function (results) {
                $scope.results = results.data;
                $scope.products = results.data.products;
                $scope.facets = mapFacets(results.data.facets);

                $scope.pageSize = results.data.pages.perPage || $scope.pageSize;
                $scope.pageNum = results.data.pages.current || $scope.pageNum;
                $scope.totalPages = results.data.pages.total;

                // For ng-repeat
                $scope.pageRange = new Array($scope.totalPages);

                // Default displayVariant is masterVariant, but server might return other if color filters are being applied
                for (var i = 0; i < results.data.products.length; i++) {
                    $scope.products[i].displayVariant = $scope.products[i].displayVariant || $scope.products[i].masterVariant;
                }

            })

        }



        $scope.getCategory = function () {
            var slug = $stateParams.slug
            return slug
        }

        $scope.fetchRecommendedProducts = function (category, gender, pageSize) {
            var promise = new Promise(function (resolve, reject) {
                var products = {}

                if (!category) {
                    return
                }
                var filters = {};
                if (gender) {
                    filters.gender = {
                        value: "\""+gender+"\"",
                        isText: false
                    };
                }


                $scope.sort = {}
                ProductService.listBy(category, undefined, filters, 1, pageSize || 5, $scope.selectedSort.sortAttr, $scope.selectedSort.sortAsc).then(function (results) {
                    if (results.data.products.length > 0) {
                        products = results.data.products;

                    }

                    resolve(products)
                })
            })

            return promise;
        }

        $scope.selectFilter = function (filterName,term) {
            if ($scope.selectedFilters [filterName][term] === false) {
                delete $scope.selectedFilters [filterName][term];
                if (_.isEmpty($scope.selectedFilters [filterName])) {
                    delete $scope.productFilters[filterName];
                    delete $scope.selectedFilters[filterName];
                }
            }
            $scope.init ();
        };

        $scope.clearFilter = function (filterName) {
            delete $scope.productFilters[filterName];
            delete $scope.selectedFilters[filterName];
            $scope.init();
            return false;
        }
        $scope.priceChange = function (minValue,maxValue) {
            $scope.productFiltersMin = parseInt(minValue);
            $scope.productFiltersMax = parseInt(maxValue);
            $scope.init();
            return;
        };

        $scope.minChange = function (value) {
            if (value) {
                $scope.productFiltersMin = value;
            }
            return;
        };
        $scope.maxChange = function (value) {
            if (value) {
                $scope.productFiltersMax = value;
            }
            return;
        };


        $scope.sortBy = function (sortName) {
            if ($scope.FETCHING) // Avoid queing sort requests
                return


            //TODO remove this
            if ($scope.sort) {
                var value = ($scope.sort[sortName] == "ASC" ? "DESC" : "ASC")
                $scope.sort[sortName] = value
            }
            else {
                $scope.sort = {}
            }
            //UP to here


            var newSort = _.find ($scope.sortAttributes, function (item) {
                return item.name === sortName;
            });
            if (newSort.sortAttr == $scope.selectedSort.sortAttr) {
                newSort.sortAsc = !$scope.selectedSort.sortAsc;
            }
            $scope.selectedSort = newSort;
            $scope.init();
            return false;
        }

        // Find existing Product
        $scope.findOne = function () {
            $scope.product = Products.get({
                productId: $stateParams.productId
            });
        };

        $scope.quantity = 1;

        $scope.incrementQuantity = function () {
            $scope.quantity++;
        }

        $scope.decrementQuantity = function () {
            if ($scope.quantity > 1)
                $scope.quantity--;
        }

        $scope.addToCart = function (inStock) {
            if ($scope.isAvailable) {
                if (inStock) {
                    if (!$scope.distributionChannel) {
                        $scope.error.distributionChannel = "Please select an option";
                    } else {
                        $scope.error.distributionChannel = null;
                        CartService.addToCart($scope.product.id, $scope.currentVariant.id, $scope.distributionChannel, $scope.quantity);
                    }
                } else {
                    LoggerServices.error("Product out of stock")
                }
            }
        };

        $scope.switchImageBig = function (image) {
            $scope.imgBig = image;
        }
        $scope.view = function (id) {
            if (!id)
                id = $stateParams.id

            $scope.recommendedProducts = []

            var products = new Products({id: id})
            products.$get({id: id}, function (result) {
                $scope.product = result.product;
                if (result.product.metaTitle) {
                    $('title').text(result.product.metaTitle.en);
                }
                if (result.product.metaDescription) {
                    $('meta[name=description]').attr('content', result.product.metaDescription.en);
                }
                $rootScope.productShare = result.product;

                $scope.product.variants.unshift($scope.product.masterVariant);
                var parameterVariant = $scope.product.masterVariant;
                if($rootScope.productSkuDisplay){
                     parameterVariant = _.find($scope.product.variants,{sku:$rootScope.productSkuDisplay});

                }
                $scope.currentVariant = setAttributes (parameterVariant);


                if ($scope.currentVariant.prices.length === 1) {
                    $scope.distributionChannel = $scope.currentVariant.prices[0].channel.key;
                }
                $scope.facets = result.facets;
                if (result.product.categories[0].obj.slug.en === "eyewear") {
                    delete $scope.facets.mirrorColor;
                    delete $scope.facets.lensColor;
                }
                $scope.channels = result.channels;
                $scope.facetsArray = [];

                if ($scope.currentVariant.images[0] != null) {
                    $scope.imgBig = $scope.currentVariant.images[0].url;
                    $scope.imageThumbnails = $scope.currentVariant.images;
                }
                else {
                    $scope.imgBig = '/design/image-not-found.jpg';
                    $scope.imageThumbnails = null;
                }

                _.each(Object.keys(result.facets), function (key) {
                    if (result.facets[key].length > 0) {
                        var displayName = key;
                        if (key === "lensColor" && result.product.categories[0].obj.slug.en === "eyewear") {
                            displayName = "LensOption"
                        }
                        $scope.facetsArray.push({name: key, value: result.facets[key],displayName:displayName});
                    }

                });
                _.each($scope.facetsArray,function(facet){
                    var value = _.find($scope.currentVariant.attributes,{name:facet.name});
                    if(value){
                        $scope.selectVariant(facet.name,value.value.key);
                    }
                });




                // Breadcrumbs
                $scope.breadcrumbs = {};
                $scope.breadcrumbs.category = $scope.product.categories[0].obj.slug.en;

                var gender = _.find($scope.product.masterVariant.attributes, {name: "gender"});
                if (gender) {
                    $scope.breadcrumbs.sub_category = {
                        show: true,
                        name: (gender.value.key + "'s " + $scope.breadcrumbs.category).toLowerCase(),
                        url: ("/#!/" + gender.value.key + "/" + $scope.breadcrumbs.category).toLowerCase()
                    };
                    $scope.fetchRecommendedProducts($scope.product.categories[0].obj.slug.en, gender.value.key)
                        .then(function (result) {
                            $scope.$apply(function () {
                                $scope.recommendedProducts = result
                            })
                        });
                }

                //$scope.variantImages = flattenImages($scope.product.variants)

                $scope.facetsArrayCopy = angular.copy($scope.facetsArray);
                removeFacetsOptionsNotAvailable();
            })

        };

        var removeFacetsOptionsNotAvailable = function(){

            if(!$scope.facetsArrayCopy){
                return;
            }
            $scope.facetsArray = angular.copy($scope.facetsArrayCopy);
            var key = 'frameColor';
            var firstValue = $scope.currentFilters[key];

            var variants = _.filter($scope.product.variants, function (variant) {
                var exists = false;
                _.each(variant.attributes, function (attribute) {
                    if (attribute.name == key && (attribute.value.key == $scope.currentFilters[key] || attribute.value.label.en == $scope.currentFilters[key])) {
                        exists = true;
                    }

                });
                return exists;


            });

            if($scope.currentFilters['lensColor']){
                variants = _.filter(variants, function (variant) {
                    var existsLensColor = false;
                    var existsFrameColor = false;
                    _.each(variant.attributes, function (attribute) {
                        _.each(_.find($scope.facetsArray, { name :'lensColor'}).value, function (lensColor) {
                            if ( attribute.name == 'lensColor' && (attribute.value.key == lensColor.term || attribute.value.label.en == lensColor.term)) {
                                existsLensColor = true;
                            }
                            if ( attribute.name == 'frameColor' && (attribute.value.key == firstValue || attribute.value.label.en == firstValue)) {
                                existsFrameColor = true;
                            }
                        })


                    });
                    return existsLensColor && existsFrameColor;
                });
                _.each($scope.facetsArray, function(facet){
                    if(facet.name == 'lensColor') {
                        _.remove(facet.value, function (facetValue) {
                            var remove = true;
                            _.each(variants, function (variant) {
                                _.each(variant.attributes, function (attribute) {
                                    if (attribute.name == 'lensColor' && (attribute.value.key == facetValue.term || attribute.value.label.en == facetValue.term)) {
                                        remove = false;
                                    }
                                });
                            });
                            return remove;
                        });
                    }
                });
            }
            if($scope.currentFilters['mirrorColor']){

                variants = _.filter(variants, function (variant) {
                    var existsMirrorColor = false;
                    var existsLensColor = false;
                    var existsFrameColor = false;
                    _.each(variant.attributes, function (attribute) {
                        _.each(_.find($scope.facetsArray, { name :'mirrorColor'}).value, function (mirrorColor) {
                            if (attribute.name == 'mirrorColor' && (attribute.value.key == mirrorColor.term || attribute.value.label.en == mirrorColor.term)) {
                                existsMirrorColor = true;
                            }
                            if ( attribute.name == 'lensColor' && (attribute.value.key == $scope.currentFilters['lensColor'] || attribute.value.label.en == $scope.currentFilters['lensColor'])) {
                                existsLensColor = true;
                            }
                            if ( attribute.name == 'frameColor' && (attribute.value.key == firstValue || attribute.value.label.en == firstValue)) {
                                existsFrameColor = true;
                            }
                        })


                    });
                    return existsMirrorColor && existsLensColor && existsFrameColor;


                });
                _.each($scope.facetsArray, function(facet){
                    if(facet.name == 'mirrorColor') {
                        _.remove(facet.value, function (facetValue) {
                            var remove = true;
                            _.each(variants, function (variant) {
                                _.each(variant.attributes, function (attribute) {
                                    if (attribute.name == 'mirrorColor' && (attribute.value.key == facetValue.term || attribute.value.label.en == facetValue.term)) {
                                        remove = false;
                                    }
                                });
                            });
                            return remove;
                        });
                        var existFilter = _.find(facet.value, { term: $scope.currentFilters['mirrorColor']});
                        if(!existFilter){
                            $scope.currentFilters['mirrorColor'] = facet.value[0].term;
                        }
                    }
                });

            }else {
                _.each($scope.facetsArray, function (facet) {
                    if (facet.name == 'mirrorColor') {
                        facet.value = [];
                    }
                });
            }
        };


        var setAttributes = function (product) {
          product.frameShape = _.find  (product.attributes, function (attr) {
             return attr.name  == 'frameShape';
          });
            product.frameType = _.find  (product.attributes, function (attr) {
                return attr.name  == 'frameType';
            });
            product.frameMaterial = _.find  (product.attributes, function (attr) {
                return attr.name  == 'frameMaterial';
            });
            product.mirrorReflection = _.find  (product.attributes, function (attr) {
                return attr.name  == 'mirrorReflection';
            });
            product.width = _.find  (product.attributes, function (attr) {
                return attr.name  == 'width';
            });
            return product;
        };

        var setCurrentVariant = function (variant) {
            $scope.currentVariant = setAttributes (variant);

            _.each ($scope.currentVariant.prices, function (price){
               price.channel = _.find ($scope.channels,function (channel) {
                   return channel.id === price.channel.id;
               })
            });
            $scope.price = $scope.currentVariant.prices[0];
            if ($scope.currentVariant.prices.length === 1) {
                $scope.distributionChannel = $scope.currentVariant.prices[0].channel.key;
            }

            if ($scope.currentVariant.images[0] != null) {
                $scope.imgBig = $scope.currentVariant.images[0].url;
                $scope.imageThumbnails = $scope.currentVariant.images;
            }
            else {
                  $scope.imgBig = '/design/image-not-found.jpg';
                  $scope.imageThumbnails = null;
            }
            $scope.isAvailable = true;


            //ProductService.inventory($scope.currentVariant.sku).then(function (result) {
            //    $scope.inventory = result.data;
            //    $scope.isAvailable = validateInvetory($scope.inventory);
            //
            //    // This is to fix quantity that could have been set to a greater Q than the current selected variant has.
            //    $scope.quantity = 1;
            //
            //    $scope.showBackorderText = $scope.backorderAvaliable && !($scope.inventory.availableQuantity >= $scope.quantity);
            //}).finally(function () {
            //    $loading.finish('main');
            //});


        }

        var changeImageForOptical = function (attrKey,attrValue) {
            if (attrKey === "frameColor") {
                var foundVariant = _.find($scope.product.variants, function (variant) {
                    var foundAttribute = _.find(variant.attributes, function (attribute) {
                        return (attribute.name == attrKey && (attribute.value.key == attrValue || attribute.value.label.en == attrValue));                        return foundVariant != undefined;
                    });
                    return foundAttribute != undefined;
                });
                if (foundVariant) {
                    if (foundVariant.images[0] != null) {
                        $scope.imgBig = foundVariant.images[0].url;
                        $scope.imageThumbnails = foundVariant.images;
                    }
                    else {
                        $scope.imgBig = '/design/image-not-found.jpg';
                        $scope.imageThumbnails = null;
                    }
                }

            }
        }


        $scope.selectVariant = function (attrKey, attrValue) {
            changeImageForOptical (attrKey,attrValue);
            $scope.currentFilters[attrKey] = attrValue;
            var notUndefinedFacetLength = _.filter($scope.facetsArray, function (filter) {
                return filter.value.length > 0
            }).length;
            removeFacetsOptionsNotAvailable();

            if (notUndefinedFacetLength == Object.keys($scope.currentFilters).length) {


                // Variants.
                var variantFound = _.find($scope.product.variants, function (variant) {
                    var complies = 0;

                    _.each(Object.keys($scope.currentFilters), function (filterKey) {
                        // Attributes of Variant.
                        _.each(variant.attributes, function (attribute) {
                           if (attribute.name == filterKey && (attribute.value.key == $scope.currentFilters[filterKey] || attribute.value.label.en == $scope.currentFilters[filterKey])) {
                                complies++;
                                return;
                            }

                        });

                    });

                    // If complies = filters, we found it.
                    return Object.keys($scope.currentFilters).length == complies;


                });
                if (variantFound != undefined) {
                    setCurrentVariant(variantFound);

                }
                else {
                    $scope.isAvailable = false;
                    LoggerServices.warning('This variant is not available.');
                    return;
                }
            }
        }

        $scope.formatFacetName = function (name) {
            return name.replace(/([A-Z])/g, ' $1')
                // uppercase the first character
                .replace(/^./, function(str){ return str.toUpperCase(); })
        }

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $scope.channelInfo = function (price) {
            var channel =_.find ($scope.channels,function (item) {
                return item.id == price.channel.id;
            });
            return channel;
        }

        $scope.redirectToProduct = function (slug,sku) {
            $rootScope.productSkuDisplay = sku;
            $location.path("/products/" + slug);
        }

    }
]);

'use strict';

var module = angular.module('products');

module.directive('latestProducts', ['ProductService', function (ProductService) {
    return {
        templateUrl: 'modules/products/templates/latest-products.client.template.html',
        restrict: 'E',
        scope: {
            category: '@',
            gender: '@',
            length: '@'
        },
        replace: true,
        link: function($scope){
            $scope.sort = {}
            $scope.pageSize = $scope.length || 4;

            $scope.products = []
            var filters = {};
            if ($scope.gender) {
                filters.gender = {
                    value: "\""+$scope.gender.toUpperCase()+"\"",
                    isText: false
                };
            }

            ProductService.listBy($scope.category, undefined, filters, 1, $scope.pageSize, 'name.en', true).then(function (results) {
                if (results.data.products.length > 0) {
                    $scope.products = results.data.products;

                }
            });
        }
    }
}])

'use strict';

var module = angular.module('products');

module.directive('productThumbnail', ["$rootScope", function ($rootScope) {
	return {
		templateUrl: 'modules/products/templates/product.client.template.html',
		restrict: 'E',
		scope: {
			product: '=',
			//currency: '=',
			//lang: '='
		},
		replace: true,
		link: function($scope){
			$scope.currency = 'USD'
			$scope.lang = 'en'


			if(!$scope.product.hasOwnProperty('displayVariant')){
				$scope.product.displayVariant = $scope.product.masterVariant;
			}
			$scope.product.displayVariant.isNew = false;
			for (var i = 0; i < $scope.product.displayVariant.attributes.length; i++) {
				if ($scope.product.displayVariant.attributes[i].name == "isNew") {
					$scope.product.displayVariant.isNew = true;
					break;
				}
			}

			$scope.ready = true;

			$scope.setProductSkuDisplay = function(sku){
				$rootScope.productSkuDisplay = sku;
			};
		}
	}
}])


'use strict';

var currencyCodeMap = {
  EUR: '€',
  USD: '$'
};

var module = angular.module('products');

module.filter('facets', function(){
  return function(input){
    if(terms.hasOwnProperty(input)){
      return terms[input]
    }else{
      return input
    }
  }
})

// Move to commons
module.filter('spherePrice', function(){
  return function(price){

    if(!price)
      return

    if(price.hasOwnProperty('value'))
        price = price.value

    var amount = (price.centAmount/100).toFixed(2)
    var result;

    switch(price.currencyCode){
      case "EUR":
        result = amount + currencyCodeMap[price.currencyCode]
        break;
      case "USD":
        result = currencyCodeMap[price.currencyCode] + amount
    }

    return result;
  }
});

// Returns an array with all the prices with the selected currency
module.filter('currency', ["appDefaults", function(appDefaults){
    return function(input, currency){
        var prices = [];

        currency = currency || appDefaults.currency;

        if(typeof input == 'object'){
            for(var key in input){
                var price = input[key];
                if (price && price.value.currencyCode == currency) {
                    prices.push(price)
                }
            }
        }

        return prices;
    }
}]);

module.filter('channel', function(){
    return function(input, channel){
        if(typeof input == 'object' && channel) {
            var return_price = null;
            if(typeof channel == 'string') {
                for(var key in input){
                    var price = input[key];
                    if (price && price.channel.key == channel) {
                        return_price = price;
                        break;
                    }
                }
            }

            if(!return_price && price) return_price = price;

            return return_price;
        }

        return null
    }
});

module.filter('sphereDate', function(){
  return function(input){
      return new Date(Date.parse(input))
  }
})

module.filter('localeDate', function(){
  return function(input){
      return input.toLocaleDateString()
  }
})

module.filter('label', function(){
    return function(input){
        if(!input)
            return 'N/A'
        else {
            if (input.toString() == "true") return "Yes";
            if (input.toString() == "false") return "No";
            return input.charAt(0).toUpperCase() + input.slice(1);
        }
    }
});

// Should get the enum locale'd labels, that's what they're for
var terms = {
  // frameShape
  "SQUARE": "Square",
  "ROUND": "Round",
  "RECTANGLE": "Rectangle",

  // Width
  "NARROW": "Narrow",
  "WIDE": "Wide",
  "MEDIUM": "Medium"
}

'use strict';

//Products service used to communicate Products REST endpoints
angular.module('products').factory('Products', ['$resource',
	function($resource) {
		return $resource('api/products/:id', { id: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
      get: {
        method: 'GET'
      }
		});
	}
]);

'use strict';

//Events service used to communicate Events REST endpoints
angular.module('products').service('ProductService', ['$http', '$q', '$location',
  function ($http, $q, $location) {
    var urlString = '/api/products';

    this.list = function () {
      var deferred = $q.defer();

      $http.get(urlString).success(function (data) {
        deferred.resolve(data);
      });

      return deferred.promise;
    }


    this.listBy = function (categoryA, categoryB, attributes, page, perPage, sortAttr, sortAsc) {
      var queryString = urlString + '/categories';

      if (categoryA != null)
        queryString += '/' + categoryA;

      if (categoryB != null)
        queryString += '/' + categoryB;

      queryString += '?page=' + (page == null ? 1 : page);
      queryString += '&perPage=' + (perPage == null ? 10 : perPage);

      if (sortAttr)
        queryString += '&sortAttr=' + sortAttr + '&sortAsc=' + sortAsc;

      return $http.post(queryString, attributes);

    }

    this.search = function (text, attributes, page, perPage, sortAttr, sortAsc) {
      var queryString = urlString + '/search/' + text;

      queryString += '?page=' + (page == null ? 1 : page);
      queryString += '&perPage=' + (perPage == null ? 10 : perPage);

      if (sortAttr)
        queryString += '&sortAttr=' + sortAttr + '&sortAsc=' + sortAsc;

      return $http.post(queryString, attributes);
    }




  }
]);
