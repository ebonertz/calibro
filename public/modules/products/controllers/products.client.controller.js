'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Products', 'ProductService', 'CartService', 'ProductUtils', 'ContentfulService', 'LoggerServices', 'lodash','$sce',
    function ($scope, $stateParams, $location, Authentication, Products, ProductService, CartService, ProductUtils, ContentfulService, LoggerServices, _,$sce) {
        $scope.authentication = Authentication;
        $scope.$location = $location;
        $scope.productFiltersMin = 0;
        $scope.productFiltersMax = 500;
        $scope.perPage = 20;
        $scope.page = 1;
        $scope.filterAttributes = {};
        $scope.sortAttributes = [
            { name: 'Name', sortAttr: 'name.en', sortAsc: true },
            { name: 'Lower Price', sortAttr: 'price', sortAsc: true },
            { name: 'Higher Price', sortAttr: 'price', sortAsc: false }];

        $scope.FETCHING = false; // Will keep track of fetches
        $scope.lang = 'en';
        $scope.currency = 'USD';
        $scope.error = {}

        $scope.$utils = ProductUtils;
        $scope.facetConfig = {
            'lensColor': {
                'type': 'lenum',
                'title': 'Lens Color'
            },
            'frameColor': {
                'type': 'lenum',
                'title': 'Frame Color'
            },
            'width': {
                'type': 'lenum',
                'title': 'Frame Width'
            },
            'frameShape': {
                'type': 'lenum',
                'title': 'Frame Shape'
            },
            'frameMaterial': {
                'type': 'ltext',
                'title': 'Frame Material'
            },

        }
        $scope.lenumFacets = ["width", "frameShape", "frameMaterial"];
        $scope.currentFilters = {};
        $scope.isAvailable = false;

        // Find a list of Products
        $scope.find = function () {
            ProductService.list().then(function (resultsArray) {
                $scope.products = resultsArray;
            })
        };

        $scope.init = function () {
            if ($stateParams.slug) {
                $scope.categoryPage();
            } else {
                $scope.searchByText();
            }

        }
        $scope.optionFilter = function (value) {
            if (value) {
                if (value == "prescription") {
                    $scope.productFilters['options'] = '"PROGRESSIVE","SINGLEVISION"';
                }
                if (value == "frames") $scope.productFilters['options'] = '"NONPRESCRIPTION"';

            } else {
                delete $scope.productFilters['options'];
            }
            $scope.init();
        }
        $scope.categoryPage = function (options) {
            options = options || {}

            // Makes sure no other fetches are being executed at the same time
            if ($scope.FETCHING) {
                console.log('Already fetching')
                return
            }
            try {
                $scope.FETCHING = true;

                var query, gender;

                // Get category slug
                var slug = $stateParams.slug
                $scope.category = slug;
                $scope.productFilters = $scope.productFilters || {} // Init by default


                // Add gender to filters if found in stateParams (url)
                if ($stateParams.gender) {
                    gender = $stateParams.gender;
                    $scope.gender = gender;

                    // Both genders will include unisex products
                    $scope.productFilters.gender = {}
                    $scope.productFilters.gender['UNISEX'] = true;
                    $scope.productFilters.gender[gender.toUpperCase()] = true;
                }

                query = buildQuery();

                $scope.sort = $scope.sort || {name: "ASC"}
                $scope.pageSize = $scope.pageSize || 20; // TODO: Move to config
                $scope.pageNum = options.pageNum || 1;

                $scope.pageTitle = $scope.gender ? $scope.gender + "'s " + $scope.category : $scope.category;

                var facets = Object.keys($scope.facetConfig)
                ProductService.getByCategorySlug(slug, query, facets, $scope.sort, $scope.byQuery, $scope.pageSize, $scope.pageNum).then(function (resultsArray) {
                    $scope.products = resultsArray.products
                    $scope.facets = resultsArray.facets

                    $scope.pageSize = resultsArray.pages.perPage || $scope.pageSize;
                    $scope.pageNum = resultsArray.pages.current || $scope.pageNum;
                    $scope.totalPages = resultsArray.pages.total;

                    // For ng-repeat
                    $scope.pageRange = new Array($scope.totalPages);

                    // Default displayVariant is masterVariant, but server might return other if color filters are being applied
                    for (var i = 0; i < resultsArray.products.length; i++) {
                        $scope.products[i].displayVariant = $scope.products[i].displayVariant || $scope.products[i].masterVariant;
                    }


                })
            } catch (e) {
                console.log(e)
            } finally {
                $scope.FETCHING = false;
            }
        }


        $scope.searchByText = function (options) {
            options = options || {}

            // Makes sure no other fetches are being executed at the same time
            if ($scope.FETCHING) {
                console.log('Already fetching')
                return
            }
            try {
                $scope.FETCHING = true;

                var slug, query, gender;

                // Get category slug
                var text = $stateParams.text
                $scope.category = 'Search';
                $scope.productFilters = $scope.productFilters || {} // Init by default

                // Add gender to filters if found in stateParams (url)
                if ($stateParams.gender) {
                    gender = $stateParams.gender;
                    $scope.gender = gender;

                    // Both genders will include unisex products
                    $scope.productFilters.gender = {}
                    $scope.productFilters.gender['UNISEX'] = true;
                    $scope.productFilters.gender[gender.toUpperCase()] = true;
                }

                query = buildQuery();

                $scope.sort = $scope.sort || {name: "ASC"}
                $scope.pageSize = $scope.pageSize || 20; // TODO: Move to config
                $scope.pageNum = options.pageNum || 1;

                $scope.pageTitle = 'Search';

                var facets = Object.keys($scope.facetConfig)
                ProductService.searchByText(text, query, facets, $scope.sort, $scope.byQuery, $scope.pageSize, $scope.pageNum).then(function (resultsArray) {
                    $scope.products = resultsArray.products
                    $scope.facets = resultsArray.facets

                    $scope.pageSize = resultsArray.pages.perPage || $scope.pageSize;
                    $scope.pageNum = resultsArray.pages.current || $scope.pageNum;
                    $scope.totalPages = resultsArray.pages.total;

                    // For ng-repeat
                    $scope.pageRange = new Array($scope.totalPages);

                    // Default displayVariant is masterVariant, but server might return other if color filters are being applied
                    for (var i = 0; i < resultsArray.products.length; i++) {
                        $scope.products[i].displayVariant = $scope.products[i].displayVariant || $scope.products[i].masterVariant;
                    }
                })
            } catch (e) {
                console.log(e)
            } finally {
                $scope.FETCHING = false;
            }
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

                if (gender) {
                    $scope.query = {gender: gender}
                } else {
                    $scope.query = {}
                }

                $scope.sort = {}
                $scope.pageSize = pageSize || 5;
                ProductService.getByCategorySlug(category, $scope.query, {}, $scope.sort, {}, $scope.pageSize, 1).then(function (resultsArray) {
                    if (resultsArray.products.length > 0) {
                        products = resultsArray.products
                    }

                    resolve(products)
                })
            })

            return promise;
        }

        var buildQuery = function () {
            // Build query object
            var query = {}
            $scope.byQuery = []
            for (var filterKey in $scope.productFilters) {
                var filter = $scope.productFilters[filterKey];

                if (typeof filter === "string") {
                    query[filterKey] = filter;
                    $scope.byQuery.push(filterKey)
                } else {
                    for (var value in filter) {
                        // Add filter to query object if it has any true value
                        if (filter[value]) {
                            if (query.hasOwnProperty(filterKey)) {
                                query[filterKey] = query[filterKey] + ";" + value
                            } else {
                                query[filterKey] = value
                                $scope.byQuery.push(filterKey)
                            }
                        }
                    }
                }
            }

            return query;
        }

        $scope.clearFilter = function (filterName) {
            delete $scope.productFilters[filterName];
            $scope.init();
            return false;
        }
        $scope.priceRange = function () {
            // var range = $scope.productFilters['price'].split("-");
            // $scope.productFiltersMin = parseInt(range[0]);
            // $scope.productFiltersMax = parseInt(range[1]);
            $scope.init();
            return;
        };

        $scope.minChange = function (value) {
            if (value) {
                $scope.productFiltersMin = value;
                $scope.productFilters['price'] = value + "-" + $scope.productFiltersMax;
            }
            return;
        };
        $scope.maxChange = function (value) {
            if (value) {
                $scope.productFiltersMax = value;
                $scope.productFilters['price'] = $scope.productFiltersMin + "-" + value;
            }
            return;
        };


        $scope.sortBy = function (sortName) {
            if ($scope.FETCHING) // Avoid queing sort requests
                return

            var value = ($scope.sort[sortName] == "ASC" ? "DESC" : "ASC")
            $scope.sort = {}
            $scope.sort[sortName] = value
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
                $scope.currentVariant = $scope.product.masterVariant;

                $scope.currentVariant.attr = {};
                _.each ($scope.currentVariant.attributes,function (item){
                    if (item.value.label) {
                        $scope.currentVariant.attr[item.name] = item.value.label.en ? item.value.label.en : item.value.label;

                    }
                    else {
                        $scope.currentVariant.attr[item.name] = item.value.en ? item.value.en : item.value;
                    }
                });

                $scope.product.variants.unshift($scope.product.masterVariant);
                $scope.facets = result.facets;
                $scope.channels = result.channels;
                $scope.facetsArray = [];
                $scope.imgBig = $scope.currentVariant.images[0]['url'];

                _.each(Object.keys(result.facets), function (key) {
                    if (result.facets[key].length > 0) {
                        $scope.facetsArray.push({name: key, value: result.facets[key]});
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


        var setCurrentVariant = function (variant) {
            $scope.currentVariant = variant;

            $scope.price = $scope.currentVariant.prices[0];

            if ($scope.currentVariant.images[0] != null) {
                $scope.imgBig = $scope.currentVariant.images[0].url;
            }
            else {
                  $scope.imgBig = $scope.product.masterVariant.images [0].url;
                  $scope.currentVariant.images = $scope.product.masterVariant.images;
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

        $scope.selectVariant = function (attrKey, attrValue) {

            $scope.currentFilters[attrKey] = attrValue;
            var notUndefinedFacetLength = _.filter($scope.facetsArray, function (filter) {
                return filter.value.length > 0
            }).length;

            if (notUndefinedFacetLength == Object.keys($scope.currentFilters).length) {
                // Variants.
                var wasVariantFound = false;
                _.each($scope.product.variants, function (variant) {
                    var complies = 0;

                    _.each(Object.keys($scope.currentFilters), function (filterKey) {
                        // Attributes of Variant.
                        _.each(variant.attributes, function (attribute) {

                            if (attribute.name == filterKey && (attribute.value.label == $scope.currentFilters[filterKey] || attribute.value.label.en == $scope.currentFilters[filterKey])) {
                                complies++;
                                return;
                            }

                        })

                    })

                    // If complies = filters, we found it.
                    if (Object.keys($scope.currentFilters).length == complies) {
                        setCurrentVariant(variant);
                        wasVariantFound = true;
                        return;
                    }

                });
                if (!wasVariantFound) {
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

        $scope.isNew = function (product) {
            return _.find(product.attributes, {name: "isNew"});
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
