var qs = require('querystring');
var url = require('url');
var path = require('path');

function user(){
  console.log("CONSTRUCTED USER CONTROLLER");
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

function createUser(request, response, fn) {
	console.log("CREATING USER...");
  
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
		console.log("CREATED USER: " + json);
		
		response.write(json);
		fn(response);
	});
};

function readUser(request, response, fn) {
  console.log("READING USER...");
  
  var id = path.basename(url.parse(request.url).pathname);
  
  // dummy data
  var u = new userObj(id, 'Spongebob', 'Squarepants', 'bob@xpanxion.com', '555-555-5555', 123, 'squidward');
  var json = JSON.stringify(u);
  console.log("READ USER: " + json);
  
  response.write(json);
  fn(response);
};

function updateUser(request, response, fn) {
	console.log("UPDATING USER");
  
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
		console.log("UPDATED USER: " + json);
		
		response.write(json);
		fn(response);
	});
};

function deleteUser(request, response, fn) {
	console.log("DELETING USER...");
  
	var id = path.basename(url.parse(request.url).pathname);
	console.log('DELETED USER: ' + id);
   
	fn(response);
};

user.prototype.processRequest = function(request, response, fn) {

	switch(request.method) {
		case "POST":
			createUser(request, response, function() {
				fn(response);
			});
			break;
		case "GET":
			readUser(request, response, function() {
				fn(response);
			});
			break;
		case "PUT":
			updateUser(request, response, function() {
				fn(response);
			});
			break;
		case "DELETE":
			deleteUser(request, response, function() {
				fn(response);
			});
		break;
	}
};

module.exports = user;