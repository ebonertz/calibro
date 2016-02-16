'use strict';

var MandrillClient = require('../clients/mandrill.server.client.js');
var _ = require('lodash');

exports.send_one = function (options, callback) {
	if(!options.email) {
		console.log("No email to send to")
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
        console.log("ERROR Template "+options.template+" not found in config. Email could not be sent.")
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

exports.welcome = function (email) {
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
	return exports.send_one(options)
}

exports.contactUs = function(email, name, message){
	var options = {
		email: MandrillClient.addresses.contactus_email,
		template: 'contactus',
		template_content: [
			{
				"name": "name",
				"content": name
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
	return exports.send_one(options)
}

exports.sendPasswordToken = function(email, link){
	var options = {
		email: email,
		template: 'passwordtoken',
		template_content: [
			{
				"name": "email",
				"content": email
			},
			{
				"name": "link",
				"content": link
			}
		]
	}
	return exports.send_one(options)
}

exports.sendAttachment = function(email, subject, file_name, file_contents, file_type) {
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
	return exports.send_one(options)
}

exports.orderCreated = function(email, orderId, link){
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
	return exports.send_one(options)
}
exports.orderConfirmation = function(email, order, link){

	var lineItems = [];
	_.each(order.lineItems,function(lineItem){
		var item = {};
		item.quantity = lineItem.quantity;
		item.name = lineItem.name.en;
		item.price = lineItem.price.value.centAmount /100;
		item.currency = lineItem.price.value.currencyCode;
		lineItems.push(item);
	});

	var shippingPrice = {
		price : order.shippingInfo.price.centAmount / 100,
		currency : order.shippingInfo.price.currencyCode
	};
	var totalPrice = {
		price : order.totalPrice.centAmount / 100,
		currency : order.totalPrice.currencyCode
	};
	var subTotal = {
		price : totalPrice.price -shippingPrice.price,
		currency : order.totalPrice.currencyCode
	};

	var orderDate = order.createdAt.substr(8,2) + "/"+order.createdAt.substr(5,2)+ "/" + order.createdAt.substr(0,4);
	var options = {
		email: email,
		template: 'orderConfirmation',
		global_merge_vars: [
			{
				"name": "orderDate",
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
        "content": totalPrice
      },
      {
        "name": "subTotal",
        "content": subTotal
      },
      {
        "name": "shippingPrice",
        "content": shippingPrice
      },
			{
				"name": "link",
				"content": link
			}
		]
	}
	return exports.send_one(options)
}
