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

		this.getByCategorySlug = function(slug, query, facets, byQuery) {
			var deferred = $q.defer();

			var queryString = ""
			for(var queryName in query){
				queryString = queryString + queryName + "=" + query[queryName] + "&"
			}

			if(facets.length > 0){
				queryString = queryString + "facets="

				for(var i = 0; i < facets.length; i++){
					queryString = queryString + facets[i] + ";"
				}
				queryString = queryString.slice(0,-1).concat('&')
			}

			if(byQuery.length > 0){
				queryString = queryString + "byQuery="

				for(var i = 0; i < byQuery.length; i++){
					queryString = queryString + byQuery[i] + ";"
				}
			}
			
			queryString = queryString.slice(0,-1);

			var url = (queryString.length > 0 ? '/categories/'+slug+'?'+queryString : '/categories/'+slug);

			$http.get(url).success(function (data) {
				deferred.resolve(data);
			});

			return deferred.promise;
		}
	}
]);