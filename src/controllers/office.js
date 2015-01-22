var qs = require('querystring');
var url = require('url');
var path = require('path');
var util = require("./controllerFunctions");

var VALID_QUERY_PARAMS = {};
var VALID_POST_PARAMS = {'phone' : 'numeric', 'address' : 'ascii', 'name' : 'ascii'};

function officeObj(id, phone, address, name) {
  this.id = id;
  this.phone = phone;
  this.address = address;
  this.name = name;
};

function createOffice(request, response) {
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
			var o = new officeObj(id, post['phone'], post['address'], post['name']);
			json = JSON.stringify(o);
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

function readOffice(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	var json;
  
	if(id !== 'office') {
		// dummy data
		if(!isNaN(id)) {
			var o = new officeObj(id, '1234567890', '831 Bottomfeeder Lane', 'The Krusty Krab');
			json = JSON.stringify(o);
		} else {
			json = JSON.stringify('{}');
		}
	} else {
		json = JSON.stringify('[]');
	}
    
	response.write(json);
	response.end();
};

function updateOffice(request, response) {
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
			var o = new officeObj(id, '1234567890', '831 Bottomfeeder Lane', 'The Krusty Krab');
			
			// set fields to new values
			for(var prop in post) {
				if(typeof o[prop] !== 'undefined') {
					o[prop] = post[prop];
				}
			}
			json = JSON.stringify(o);
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

function deleteOffice(request, response) {
	var id = path.basename(url.parse(request.url).pathname);
	// dummy data
	var o = new officeObj(id, '1234567890', '831 Bottomfeeder Lane', 'The Krusty Krab');
	var json = JSON.stringify(o);
	var code = 200;
	response.writeHead(code, {'Content-Type':'application/json'});
	response.write(json);
	response.end();
};

module.exports.handleRequest = function(request, response,connection){
	switch(request.method) {
		case "POST":
			createOffice(request, response);
			break;
		case "GET":
			readOffice(request, response);
			break;
		case "PUT":
			updateOffice(request, response);
			break;
		case "DELETE":
			deleteOffice(request, response);
			break;
	}
}