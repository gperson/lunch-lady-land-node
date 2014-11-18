var qs = require('querystring');
var url = require('url');
var path = require('path');

function user(){
};

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
	
	request.on('end', function () {
		var post = qs.parse(body);
		
		// dummy id
		id = Math.floor(Math.random() * 10000);
		var u = new userObj(id, post['firstName'], post['lastName'], post['email'], post['phone'], post['office'], post['password']);
		
		var json = JSON.stringify(u);
		response.write(json);
		response.end();
	});
};

function readUser(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	var json;
  
	if(id !== 'user') {
		// dummy data
		var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '555-555-5555', 123, 'squidward');
		json = JSON.stringify(u);
	} else {
		var query = url.parse(request.url, true).query;
		if(query.office !== undefined) {
			var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '555-555-5555', query.office, 'squidward');
			json = JSON.stringify(u);
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
	
	request.on('end', function () {
		var post = qs.parse(body);
		
		// dummy data
		var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '555-555-5555', 123, 'squidward');
		
		// set fields to new values
		for(var prop in post) {
			if(typeof u[prop] !== 'undefined') {
				u[prop] = post[prop];
			}
		}
		
		var json = JSON.stringify(u);
		response.write(json);
		response.end();
	});
};

function deleteUser(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	response.end();
};

user.prototype.processRequest = function(request, response) {
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
};

module.exports = user;