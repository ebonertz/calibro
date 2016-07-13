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
            "Gold": ["GOLD"],
            "Silver": ["SILVER"],
            "Red": ["RED","RED/TORTOISE"],
            "Blue": ["BLUE","DARK BLUE","BLUE/TEAL"],
            "Black": ["BLACK","BLACK/CLEAR","BLACK ONYX FADE"],
            "Brown": ["BROWN","BROWN/TAN","PINK/BROWN","DARK BROWN","BROWN TORTOISE SHELL","MAHOGANY/BROWN","TORTISE SHELL BROWN","BROWN/AQUA"],
            "Green": ["GREEN","LIGHT GREEN","MILITARY GREEN","GREEN/TORTOISE"],
            "Grey": ["GREY","GREY (OLIVE)","GRAY FADE","GRAY/CLEAR","GRAY","GRAY (OLIVE)","GRANITE GRAY","GREY/DRIFTWOOD","GRAY/DRIFTWOOD"],
            "Purple": []
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
                $scope.find();
            } else {
                $scope.search();
            }

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
            if ($scope.selectedFilters ['width']) {

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
                    delete $scope.facets.mirrorColor
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

            })
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
            if (attrKey === "frameColor" && $scope.product.categories[0].obj.slug.en === "eyewear") {
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

    }
]);
