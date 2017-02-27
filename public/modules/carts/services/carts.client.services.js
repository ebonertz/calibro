'use strict';

//Events service used to communicate Events REST endpoints
angular.module('carts').service('CartService', ['$http', '$q', 'ipCookie', '$rootScope', 'Authentication', 'LoggerServices', 'Cart','lodash',
    function ($http, $q, ipCookie, $rootScope, Authentication, LoggerServices, Cart,_) {
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
                LoggerServices.error('Error while adding item to cart');
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

        this.calculateDiscountCode = function (cart) {
            var totalDiscountCents = 0,
                totalDiscount = {
                    centAmount: 0,
                    currencyCode: 'USD'
                };

            if (cart != null) {
                _.each(cart.lineItems, function (lineItem) {
                    var pricePerItemCentAmount = 0;

                    if (lineItem.discountedPricePerQuantity && lineItem.discountedPricePerQuantity.length > 0) {
                        _.each(lineItem.discountedPricePerQuantity, function (discountedPricePerQuantity) {
                            if(discountedPricePerQuantity.discountedPrice.includedDiscounts && discountedPricePerQuantity.discountedPrice.includedDiscounts.length > 0){
                                _.each(discountedPricePerQuantity.discountedPrice.includedDiscounts, function (includedDiscount) {
                                    totalDiscountCents += includedDiscount.discountedAmount.centAmount * discountedPricePerQuantity.quantity;
                                });
                            }
                        });
                    }
                });

                totalDiscount.centAmount = totalDiscountCents;
            }

            return totalDiscount;
        }

    }
]);
