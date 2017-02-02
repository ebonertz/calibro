var ContentfulService = require('../contentful.server.service.js');
var mockData = require('./mocks/contentful.server.mock.js');
var _ = require('lodash');

describe('ContentfulService', function(){
  it('should prune metadata', function(){
    var pruned = ContentfulService.pruneMetadataDeep(mockData.full_view);
    expect(pruned).toEqual(mockData.pruned_view);

    var keys = getKeys(pruned)
    expect(keys.indexOf('fields')).toBe(-1);
    expect(keys.indexOf('sys')).toBe(-1);
  })
});

// @return  Array  all keys in an object
var getKeys = function(obj) {
  var keys = _.flatMapDeep(obj, function(value, key){
    if (typeof value === 'object'){
      return getKeys(value);
    }
    return key
  });
  return keys;
}
