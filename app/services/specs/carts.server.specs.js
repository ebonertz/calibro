var _ = require('lodash'),
  path = require('path');

var app = require(path.resolve('specs/server-stub.js'));
var ProductService = require('../sphere/sphere.carts.server.service.js')(app);
var Cart = require('../../models/sphere/sphere.cart.server.model.js')(app);
var entity = 'carts';

function getRandomString(len) {
  len = len || 7;
  return Math.random().toString(36).substring(len);
}

function getRandomInt(top) {
  top = top || 99;
  return Math.ceil(Math.random()*top);
}

/**
 * Produce a semi-random generated flat object
 */
function getRandomFlatObject() {
  return _.reduce(
    _.range(getRandomInt(10)), function(result){
      result[getRandomString()] = getRandomString();
      return result;
    }, {}
  )
}

/**
 * TODO: Have tests for the helpers
 */
function getRandomLineItem() {
  return {
    id: getRandomString()
  }
}

describe('Cart Service', function(){
  var fakeCart,
    CommonServiceStubs;

  beforeEach(function(){
    // CommonService is currently not returning a cart instance but an obj
    fakeCart = {id: getRandomString(), version: getRandomInt()};

    CommonServiceStubs = {
      byIdAsync: function() { return Promise.resolve(fakeCart) },
      updateWithVersionAsync: function() { return Promise.resolve(fakeCart) }
    }
    spyOn(ProductService, 'getCommonService').and.returnValue(CommonServiceStubs);
    spyOn(CommonServiceStubs, 'byIdAsync').and.callThrough();
    spyOn(CommonServiceStubs, 'updateWithVersionAsync').and.callThrough();
  })

  xit('should add line items', function(done){
  })

  xit('should add custom line items', function(done){

  })

  /**
   * Update Shipping Address specs
   */

  describe('Update shipping address', function(){

    it('should update the cart setting a new shipping address', function(done) {
      var payload = getRandomFlatObject();
      var action = {action: 'setShippingAddress'};
      var reqId = getRandomString();

      ProductService.setShippingAddress(reqId, payload).then(function(cart) {
        expect(CommonServiceStubs.byIdAsync).toHaveBeenCalledWith(entity, reqId);
        expect(CommonServiceStubs.updateWithVersionAsync).toHaveBeenCalledWith(entity, fakeCart.id, fakeCart.version, [_.merge(payload, action)]);
        done();
      }).catch(function(err){
        done.fail(err)
      })
    })

  })


  /**
   * Update External Rate specs
   */
  describe('Update external rate', function(){
    var AvalaraStubs,
      recalculateAction = {
        action: 'recalculate',
        updateProductData: false
      }


    beforeEach(function() {
      var AvalaraStubs = {
        getSalesOrderTax: function(){ return Promise.resolve({TaxLines: getRandomString()}) }
      }
      spyOn(ProductService, 'getAvalaraService').and.returnValue(AvalaraStubs);
      spyOn(AvalaraStubs, 'getSalesOrderTax').and.callThrough();

      spyOn(ProductService, 'getExternalTaxRate').and.returnValue({test: getRandomString()})
    })


    // No line items or custom line items
    it('should request a recalculate action', function(done){
      var lineItems = {};
      fakeCart.lineItems = lineItems;

      ProductService.updateExternalRate(fakeCart).then(function(cart){
        expect(CommonServiceStubs.updateWithVersionAsync).toHaveBeenCalledWith(entity, cart.id, cart.version, [recalculateAction]);
        done();
      }).catch(function(err){
        done.fail(err)
      });
    });


    it('should request a setLineItemTaxRate action for each lineItem', function(done){
      var lineItems = _.times(getRandomInt(5), getRandomLineItem);
      fakeCart.lineItems = lineItems;

      var liActions = _.map(lineItems, function(li) {
        return {
          action: 'setLineItemTaxRate',
          lineItemId: li.id,
          externalTaxRate: ProductService.getExternalTaxRate()
        }
      })

      ProductService.updateExternalRate(fakeCart).then(function(cart){
        expect(CommonServiceStubs.updateWithVersionAsync).toHaveBeenCalledWith(
          entity,
          cart.id,
          cart.version,
          _.concat(liActions, recalculateAction)
        );
        done();
      }).catch(function(err){
        done.fail(err)
      });
    });


    it('should fetch the external rate for each line lineItem', function(done){
      var lineItems = getRandomFlatObject();
      fakeCart.lineItems = lineItems;

      ProductService.updateExternalRate(fakeCart).then(function(cart){
        expect(ProductService.getExternalTaxRate).toHaveBeenCalledTimes(_.size(lineItems));
        done();
      }).catch(function(err){
        done.fail(err)
      })
    })


    // Return test
    xit('should return a cart instance', function (done){
      // TODO: Review the Cart object, as it has weird stuff
      ProductService.updateExternalRate(fakeCart).then(function(cart){
        expect(cart instanceof Cart).toBe(true);
        done();
      }).catch(function(err){
        done.fail(err)
      })
    })


    // Needs a lineItem to work
    it('should request a setCustomLineItemTaxRate action for each customLineItem', function(done){
      var customLineItems = _.times(getRandomInt(5), getRandomLineItem);
      fakeCart.customLineItems = customLineItems;

      var lineItem = getRandomLineItem();
      fakeCart.lineItems = [lineItem];

      // Set up expected actions
      // for line items
      var liActions = [{
        action: 'setLineItemTaxRate',
        lineItemId: lineItem.id,
        externalTaxRate: ProductService.getExternalTaxRate()
      }]

      // For custom line items
      liActions = _.concat(liActions, _.map(customLineItems, function(li) {
          return {
            action: 'setCustomLineItemTaxRate',
            customLineItemId: li.id,
            externalTaxRate: ProductService.getExternalTaxRate()
          }
        })
      )

      ProductService.updateExternalRate(fakeCart).then(function(cart){
        expect(CommonServiceStubs.updateWithVersionAsync).toHaveBeenCalledWith(
          entity,
          cart.id,
          cart.version,
          _.concat(liActions, recalculateAction)
        );
        done();
      }).catch(function(err){
        done.fail(err)
      });
    })
  })

})
