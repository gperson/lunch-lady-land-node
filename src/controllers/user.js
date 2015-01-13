var qs = require('querystring');
var url = require('url');
var path = require('path');
var util = require("./controllerFunctions");

var VALID_QUERY_PARAMS = {'office' : 'alphanumeric'};
var VALID_POST_PARAMS = {'firstName' : 'alpha', 'lastName' : 'alpha', 'email' : 'email', 'phone' : 'numeric', 'office' : 'alphanumeric', 'password' : 'ascii'};

function userObj(id, firstName, lastName, email, phone, office, password) {
  this.id = id;
  this.firstName = firstName;
  this.lastName = lastName;
  this.email = email;
  this.phone = phone;
  this.office = office;
  this.password = password;
};

function createUser(request, response) {
	var body = '';
	
	request.on('data', function (data) {
		body += data;
	});
	
	request.on('error', function(e) {
		var json = JSON.stringify({'error': e});
		var code = 400;
		response.writeHead(code, {'Content-Type':'application/json'});
		response.write(json);
		response.end();
	});
	
	request.on('end', function () {
		var post = qs.parse(body);
		var code;
		var json;
		
		if(util.areValidParams(post, VALID_POST_PARAMS)) {
			// dummy id
			id = Math.floor(Math.random() * 10000);
			var u = new userObj(id, post['firstName'], post['lastName'], post['email'], post['phone'], post['office'], post['password']);
			json = JSON.stringify(u);
			code = 200;
		} else {
			json = JSON.stringify({'error': 'param data was invalid'});
			code = 400;
		}
		response.writeHead(code, {'Content-Type':'application/json'});
		response.write(json);
		response.end();
	});
};

function readUser(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	var json;
  
	if(id !== 'user') {
		// dummy data
		if(!isNaN(id)) {
			var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '1234567890', 123, 'squidward');
			json = JSON.stringify(u);
		} else {
			json = JSON.stringify('{}');
		}
	} else {
		var query = url.parse(request.url, true).query;
		var u1 = new userObj(15, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '1234567890', 123, 'squidward');
		var u2 = new userObj(16, 'Patrick', 'Star', 'pat@xpanxion.com', '555-555-5556', 123, 'gary');
		var users = [u1, u2];
		
		var validParams = util.getValidParams(query, VALID_QUERY_PARAMS);
		if(Object.keys(validParams).length > 0) {
			for(var param in validParams) {
				u1[param] = query[param];
				u2[param] = query[param];
			}
			json = JSON.stringify(users);
		} else {
			json = JSON.stringify('[]');
		}
	}
    
	response.write(json);
	response.end();
};

function updateUser(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	var body = '';
	
	request.on('data', function (data) {
		body += data;
	});
	
	request.on('error', function(e) {
		var json = JSON.stringify({'error': e});
		var code = 400;
		response.writeHead(code, {'Content-Type':'application/json'});
		response.write(json);
		response.end();
	});
	
	request.on('end', function () {
		var post = qs.parse(body);		
		var code;
		var json;
		
		if(util.areValidParams(post, VALID_POST_PARAMS)) {
			// dummy data
			var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '1234567890', 123, 'squidward');
			
			// set fields to new values
			for(var prop in post) {
				if(typeof u[prop] !== 'undefined') {
					u[prop] = post[prop];
				}
			}
			json = JSON.stringify(u);
			code = 200;
		} else {
			json = JSON.stringify({'error': 'param data was invalid'});
			code = 400;
		}
		response.writeHead(code, {'Content-Type':'application/json'});
		response.write(json);
		response.end();
	});
};

function deleteUser(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	// dummy data
	var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '1234567890', 123, 'squidward');
	var json = JSON.stringify(u);
	var code = 200;
	response.writeHead(code, {'Content-Type':'application/json'});
	response.write(json);
	response.end();
};

module.exports.handleRequest = function(request, response, connection){
	switch(request.method) {
		case "POST":
			createUser(request, response);
			break;
		case "GET":
			readUser(request, response);
			break;
		case "PUT":
			updateUser(request, response);
			break;
		case "DELETE":
			deleteUser(request, response);
			break;
	}
}