'use strict';

var MandrillClient = require('../clients/mandrill.server.client.js');
var _ = require('lodash');
var config = require('../../config/config');

module.exports = function (app) {
	var service = {};
	
	service.send_one = function (options, callback) {
		if(!options.email) {
			app.logger.error("No email to send to")
			return new Promise(function(reject){reject("No email")})
		}

		var to = {
			email: options.email,
			name: options.name,
		}
		var global_merge_vars = options.global_merge_vars;

		var message = {
			to: [to],
			from_email: MandrillClient.options.from_email,
			from_name: MandrillClient.options.from_name,
			subject: options.subject || null,
			html: options.html || null,
			attachments: options.attachments || null
		};
		if(global_merge_vars){
			message.global_merge_vars = global_merge_vars;
			message.merge = true;
			message.merge_language = "handlebars";
		}

		var template_content = options.template_content || [
				{
					"name": "example name",
					"content": "example content"
				}
			]

		if(!MandrillClient.templates.hasOwnProperty(options.template)){
			app.logger.error("ERROR Template %s not found in config. Email could not be sent.",options.template)
			return
		}

		var p = new Promise(function(resolve, reject){
			MandrillClient.mandrill('/messages/send-template', {
				template_name: MandrillClient.templates[options.template],
				template_content: template_content,
				message: message
			}, function(error, response) {
				//uh oh, there was an error ! REJECT
				if (error) reject(error);

				//everything's good, lets see what mandrill said
				else resolve(response);
			});
		})

		return p;
	}

	service.sendWithoutTemplate = function (options, callback) {
		if(!options.email) {
			app.logger.error("No email to send to")
			return new Promise(function(reject){reject("No email")})
		}

		var to = {
			email: options.email,
			name: options.name,
		}
		var global_merge_vars = options.global_merge_vars;

		var message = {
			to: [to],
			from_email: MandrillClient.options.from_email,
			from_name: MandrillClient.options.from_name,
			subject: options.subject || null,
			html: options.html || null,
			attachments: options.attachments || null
		};


		var p = new Promise(function(resolve, reject){
			MandrillClient.mandrill('/messages/send', {
				message: message
			}, function(error, response) {
				//uh oh, there was an error ! REJECT
				if (error) reject(error);

				//everything's good, lets see what mandrill said
				else resolve(response);
			});
		})

		return p;
	}

	service.prescription = function(email,data){
		var options = {
			email: email,
			html: '<p>PRESCRIPTION NEEDED</p><p>Call doctor ' + data.doctorName + ' from clinic ' + data.state + ' for prescription to patient : ' + data.patientName + " date of birth:" + data.patientBirth + " Doctor phone " + data.phoneNumber+'<p></p>',
			subject: 'Prescription needed'
		}
		return service.sendWithoutTemplate(options)
	};

	service.welcome = function (email) {
		var options = {
			email: email,
			template: 'welcome',
			template_content: [
				{
					"name": "email",
					"content": email
				}
			]
		}
		return service.send_one(options)
	}

	service.contactUs = function(email, name, message){
		var options = {
			email: MandrillClient.addresses.contactus_email,
			template: 'contactus',
			global_merge_vars: [
				{
					"name":"name",
					"content":name
				},
				{
					"name": "email",
					"content": email
				},
				{
					"name": "message",
					"content": message
				}
			]
		}
		return service.send_one(options)
	}

	service.sendPasswordToken = function(email, link){
		var options = {
			email: email,
			template: 'passwordtoken',
			global_merge_vars: [
				{
					"name":"link",
					"content":link
				}
			]
		}
		return service.send_one(options)
	}

	service.sendAttachment = function(email, subject, file_name, file_contents, file_type) {
		var options = {
			email: email,
			template: 'attachment',
			subject: subject,
			//template_content: [],
			attachments: [
				{
					"type": file_type,
					"name": file_name,
					"content": file_contents
				}
			],
		}
		return service.send_one(options)
	}

	service.orderCreated = function(email, orderId, link){
		var options = {
			email: email,
			template: 'order',
			template_content: [
				{
					"name": "orderId",
					"content": orderId
				},
				{
					"name": "link",
					"content": link
				}
			]
		}
		return service.send_one(options)
	}
	service.orderConfirmation = function(customer, order){

		var lineItems = [];
		var discount = 0;
		_.each(order.lineItems,function(lineItem){
			var item = {};
			item.quantity = lineItem.quantity;
			item.name = lineItem.name.en;
			item.sku = lineItem.variant.sku;
			item.subtotal = lineItem.price.value.centAmount /100 * item.quantity;
			item.currency = lineItem.price.value.currencyCode;

			var frameColor = _.first(_.filter(lineItem.variant.attributes,{name:'frameColor'}));
			item.frameColor = frameColor ? frameColor.value.label.en:"";

			var lensColor = _.first(_.filter(lineItem.variant.attributes,{name:'lensColor'}));
			item.lensOption = lensColor ? lensColor.value.label.en:"";

			var mirrorColor = _.first(_.filter(lineItem.variant.attributes,{name:'mirrorColor'}));
			item.mirrorColor = mirrorColor ? mirrorColor.value.label.en:"";

			discount  = lineItem.discountedPrice ? discount + lineItem.discountedPrice.includedDiscounts[0].discountedAmount.centAmount/100:discount;
			lineItems.push(item);
		});

		var shippingPrice = {
			price : order.shippingInfo.price.centAmount / 100,
			currency : order.shippingInfo.price.currencyCode
		};
		var totalPrice = {
			price : order.taxedPrice.totalGross.centAmount / 100,
			currency : order.taxedPrice.totalGross.currencyCode
		};
		var subTotal = {
			price : order.taxedPrice.totalNet.centAmount / 100,
			currency : order.taxedPrice.totalNet.currencyCode
		};

		var orderDate = order.createdAt.substr(8,2) + "/"+order.createdAt.substr(5,2)+ "/" + order.createdAt.substr(0,4);
		var options = {
			email: customer.email,
			template: 'orderConfirmation',
			global_merge_vars: [
				{
					"name":"customerfirstName",
					"content":customer.firstName
				},
				{
					"name":"orderNumber",
					"content":order.orderNumber
				},
				{
					"name": "order_createdat_formatted",
					"content": orderDate
				},
				{
					"name": "shippingAddress",
					"content": order.shippingAddress
				},
				{
					"name": "billingAddress",
					"content": order.billingAddress
				},
				{
					"name": "lineItems",
					"content": lineItems
				},
				{
					"name": "totalPrice",
					"content": totalPrice.price
				},
				{
					"name": "orderSubtotal",
					"content": subTotal.price
				},
				{
					"name": "shippingCost",
					"content": shippingPrice.price
				},
				{
					"name": "tax",
					"content": totalPrice.price - subTotal.price
				},
				{
					"name": "link",
					"content": config.serverPath
				},
				{
					"name": "shippingMethod",
					"content": order.shippingInfo.shippingMethodName
				},
				{
					"name": "paymentInfo",
					"content": "Credit Card"
				},
				{
					"name": "discount",
					"content": discount
				}
			]
		}
		return service.send_one(options)
	}

	return service;
}
