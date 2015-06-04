'use strict';

//Events service used to communicate Events REST endpoints
angular.module('products').service('ProductService', ['$http', '$q',
	function ($http, $q) {
		var urlString = '/products';

		this.list = function () {
			var deferred = $q.defer();

			$http.get(urlString).success(function (data) {
				deferred.resolve(data);
			});

			return deferred.promise;
		}

		this.getByCategorySlug = function(slug, sex) {
			var deferred = $q.defer();

			var url = (sex ? '/categories/'+slug+'?sex='+sex : '/categories/'+slug);

			$http.get(url).success(function (data) {
				deferred.resolve(data);
			});

			return deferred.promise;
		}
	}
]);