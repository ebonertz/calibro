'use strict';

var _ = require('lodash'),
  path = require('path'),
  Promise = require('bluebird');

var app = require(path.resolve('specs/server-stub.js'));
var CartService = require('../sphere/sphere.carts.server.service.js')(app);
var AvalaraService = require(path.resolve('app/services/avalara.server.services.js'))(app);
// var Cart = require('../../models/sphere/sphere.cart.server.model.js')(app);

function promiseStub(res) {
  return Promise.resolve(res);
}

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
  );
}

/**
 * TODO: Have tests for the helpers
 */
function getRandomLineItem() {
  return {
    id: getRandomString()
  };
}

describe('Cart Service', function(){
  var fakeCart,
    CommonServiceStubs,
    expand;

  beforeEach(function(){
    // CommonService is currently not returning a cart instance but an obj
    fakeCart = {id: getRandomString(), version: getRandomInt()};
    expand = getRandomString();

    CommonServiceStubs = {
      byId: promiseStub.bind(fakeCart),
      updateWithVersion: promiseStub.bind(fakeCart),
      update: promiseStub.bind(fakeCart)
    };
    spyOn(CartService, 'getCommonService').and.returnValue(CommonServiceStubs);
    spyOn(CommonServiceStubs, 'byId').and.callThrough();
    spyOn(CommonServiceStubs, 'updateWithVersion').and.callThrough();

    spyOn(CartService, 'updateCart').and.callFake(promiseStub.bind(fakeCart));
  });

  xit('should add line items', function(done){
  });

  xit('should add custom line items', function(done){
  });

  /**
   * Update Shipping Address specs
   */

  describe('Update shipping address', function(){

    it('should update the cart setting a new shipping address', function(done) {
      var payload = getRandomFlatObject();
      var action = {action: 'setShippingAddress'};

      CartService.setShippingAddress(fakeCart.id, payload, expand).then(function(cart) {
        expect(CartService.updateCart)
          .toHaveBeenCalledWith(fakeCart.id, [_.merge(payload, action)], expand);
        done();
      }).catch(function(err){
        done.fail(err);
      });
    });

  });


  /**
   * Update External Rate specs
   */
  describe('Update external rate', function(){
    var AvalaraStubs,
      recalculateAction = {
        action: 'recalculate',
        updateProductData: false
      };


    beforeEach(function() {
      AvalaraStubs = {
        getSalesOrderTax: promiseStub.bind({TaxLines: getRandomString()})
      };
      spyOn(CartService, 'getAvalaraService').and.returnValue(AvalaraStubs);
      spyOn(AvalaraStubs, 'getSalesOrderTax').and.callThrough();

      spyOn(CartService, 'getExternalTaxRate').and.returnValue({test: getRandomString()});
    });


    // No line items or custom line items
    it('should request a recalculate action', function(done){
      var lineItems = {};
      fakeCart.lineItems = lineItems;

      CartService.updateExternalRate(fakeCart, expand).then(function(cart){
        expect(AvalaraStubs.getSalesOrderTax)
          .toHaveBeenCalledWith(fakeCart, AvalaraService.LINE_ITEM_TAX);
        expect(CartService.updateCart)
          .toHaveBeenCalledWith(fakeCart, [recalculateAction], expand);
        done();
      }).catch(function(err){
        done.fail(err);
      });
    });


    it('should request a setLineItemTaxRate action for each lineItem', function(done){
      var lineItems = _.times(getRandomInt(5), getRandomLineItem);
      fakeCart.lineItems = lineItems;

      var liActions = _.map(lineItems, function(li) {
        return {
          action: 'setLineItemTaxRate',
          lineItemId: li.id,
          externalTaxRate: CartService.getExternalTaxRate()
        };
      });

      CartService.updateExternalRate(fakeCart, expand).then(function(cart){
        expect(CartService.updateCart)
          .toHaveBeenCalledWith(fakeCart, _.concat(liActions, recalculateAction), expand);
        done();
      }).catch(function(err){
        done.fail(err);
      });
    });


    it('should fetch the external rate for each line lineItem', function(done){
      var lineItems = getRandomFlatObject();
      fakeCart.lineItems = lineItems;

      CartService.updateExternalRate(fakeCart).then(function(cart){
        expect(CartService.getExternalTaxRate)
          .toHaveBeenCalledTimes(_.size(lineItems));
        done();
      }).catch(function(err){
        done.fail(err);
      });
    });


    // Needs a lineItem to work
    it('should request a setCustomLineItemTaxRate action for each customLineItem', function(done){
      var customLineItems = _.times(getRandomInt(5), getRandomLineItem);
      fakeCart.customLineItems = customLineItems;

      var lineItem = getRandomLineItem();
      fakeCart.lineItems = [lineItem];

      // Set up expected actions for line items
      var liActions = [{
        action: 'setLineItemTaxRate',
        lineItemId: lineItem.id,
        externalTaxRate: CartService.getExternalTaxRate()
      }];

      // For custom line items
      liActions = _.concat(liActions, _.map(customLineItems, function(li) {
          return {
            action: 'setCustomLineItemTaxRate',
            customLineItemId: li.id,
            externalTaxRate: CartService.getExternalTaxRate()
          };
        })
      );

      CartService.updateExternalRate(fakeCart, expand).then(function(cart){
        expect(cart).toBe(fakeCart);
        expect(CartService.updateCart)
          .toHaveBeenCalledWith(fakeCart, _.concat(liActions, recalculateAction), expand);
        done();
      }).catch(function(err){
        done.fail(err);
      });
    });
  });

  /**
   * Eyewear prescription count
   */

  describe('Eyewear prescription count', function() {

    // it('')
  });
});
