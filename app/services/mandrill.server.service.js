'use strict';

var MandrillClient = require('../clients/mandrill.server.client.js');

exports.send_one = function (options, callback) {
	if(!options.email)
		return false

	var to = {
		email: options.email,
		name: options.name,
	}

	var message = {
        to: [to],
        from_email: MandrillClient.options.from_email,
        from_name: MandrillClient.options.from_name,
        subject: options.subject,
        html: options.html,
        
	}

	var template_content = options.template_content || [
        {
            "name": "example name",
            "content": "example content"
        }
    ]

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
		email: MandrillClient.options.contactus_email,
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