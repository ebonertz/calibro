'use strict';

var RequestParams = function(query){

  this.params = query

  this.getFilters = function(){}
  this.getFacets = function(){}
  this.getSort = function(){}
  this.getPageSize = function(){}
}


module.exports = RequestParams;