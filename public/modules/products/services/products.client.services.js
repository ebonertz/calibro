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

		// TODO: Change parameters to options = {filters: ..., facets: ..., ...}
		this.getByCategorySlug = function(slug, query, facets, sort, byQuery) {
			var deferred = $q.defer();

			var queryString = ""
			for(var queryName in query){
				queryString = queryString + queryName + "=" + query[queryName] + "&"
			}

			if(facets && facets.length > 0){
				queryString = queryString + "facets="

				for(var i = 0; i < facets.length; i++){
					queryString = queryString + facets[i] + ";"
				}
				queryString = queryString.slice(0,-1).concat('&')
			}

			if(byQuery && byQuery.length > 0){
				queryString = queryString + "byQuery="

				for(var i = 0; i < byQuery.length; i++){
					queryString = queryString + byQuery[i] + ";"
				}

				queryString = queryString.slice(0,-1).concat('&')
			}

			if(Object.keys(sort).length > 0){
				queryString = queryString + "sort="
				for(var sortName in sort){
					queryString = queryString + sortName + ":" + sort[sortName] + ";"
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