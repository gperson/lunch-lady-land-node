var qs = require('querystring');
var url = require('url');
var path = require('path');
var common = require("./controllerFunctions");

var VALID_QUERY_PARAMS = {};
var VALID_POST_PARAMS = {'phone' : 'numeric', 'address' : 'ascii', 'name' : 'ascii'};

var SQL_QUERY_CREATE = 'INSERT INTO office SET ?';
var SQL_QUERY_UPDATE = 'UPDATE office SET ? WHERE id = ?';
var SQL_QUERY_READ = 'SELECT id, phone, address, name FROM office WHERE id = ?';
var SQL_QUERY_DELETE = 'DELETE FROM office WHERE id = ?';

/**
 * Office object.
 */
function officeObj(id, phone, address, name) {
  this.id = id;
  this.phone = phone;
  this.address = address;
  this.name = name;
};

/**
 * Insert office into db.
 * Returns the insert id.
 */
function insertQuery(conn, post, fn) {
	conn.query(SQL_QUERY_CREATE, post, function(err, result) {
		if(err) {
			fn(err);
			return;
		}
		fn(null, result.insertId);
	});
}

function updateQuery(conn, post, id, fn) {
	conn.query(SQL_QUERY_UPDATE, [post, id], function(err, result) {
		if(err) {
			fn(err);
			return;
		}
		fn(null);
	});
}

function deleteQuery(conn, id, fn) {
	conn.query(SQL_QUERY_DELETE, id, function(err, result) {
		if(err) {
			fn(err);
			return;
		}
		fn(null, result.insertId);
	});
}

/**
 * Select office from db.
 * Returns array of matching office objects.
 */
function selectQuery(conn, id, fn) {
	var objs = [];
	var query = conn.query(SQL_QUERY_READ, id);
	query.on('error', function(err) {
		fn(err);
	});
	query.on('result', function(row) {
		var obj = new officeObj(row.id, row.phone, row.address, row.name);
		objs.push(obj);
	});
	query.on('end', function() {
		fn(null, objs);
	});
}

/**
 * Read request and create new office.
 */
function createOffice(request, response, conn) {
	var body = '';
	
	request.on('data', function (data) {
		body += data;
	});
	
	request.on('error', function(err) {
		var json = JSON.stringify({'error': err});
		var code = 400;
		response.writeHead(code, {'Content-Type':'application/json'});
		response.write(json);
		response.end();
	});
	
	request.on('end', function () {
		var post = qs.parse(body);
		var code;
		var json;
		
		if(common.areValidParams(post, VALID_POST_PARAMS)) {
			insertQuery(conn, post, function(err, id) {
				if(err) {
					json = JSON.stringify({'error': err});
					code = 400;
				} else {
					var obj = new officeObj(id, post['phone'], post['address'], post['name']);
					json = JSON.stringify(obj);
					code = 200;
				}
				response.writeHead(code, {'Content-Type':'application/json'});
				response.write(json);
				response.end();
			});
		} else {
			json = JSON.stringify({'error': 'param data was invalid'});
			code = 400;
			response.writeHead(code, {'Content-Type':'application/json'});
			response.write(json);
			response.end();
		}
	});
};

/**
 * Read office by id. Only supports by id right now.
 */
 // TODO: Support other GET params.
function readOffice(request, response, conn) {
	var id = path.basename(url.parse(request.url).pathname);
	var json;
	if(isNaN(id)) {
		json = JSON.stringify({'error': 'id was not a number: ' + id});
		response.write(json);
		response.end();
		return;
	}
	selectQuery(conn, id, function(err, array) {
		if(err) {
			var json = JSON.stringify({'error': err});
			var code = 400;
		} else {
			var json = JSON.stringify(array);
			var code = 200;
		}
			response.writeHead(code, {'Content-Type':'application/json'});
			response.write(json);
			response.end();
	});
};

/**
 * Read request and update office.
 */
function updateOffice(request, response, conn) {
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
		
		if(common.areValidParams(post, VALID_POST_PARAMS)) {
			updateQuery(conn, post, id, function(err) {
				if(err) {
					json = JSON.stringify({'error': err});
					code = 400;
					response.writeHead(code, {'Content-Type':'application/json'});
					response.write(json);
					response.end();
				} else {
					selectQuery(conn, id, function(err, array) {
						if(err) {
							var json = JSON.stringify({'error': err});
							var code = 400;
						} else {
							var json = JSON.stringify(array);
							var code = 200;
						}
						response.writeHead(code, {'Content-Type':'application/json'});
						response.write(json);
						response.end();
					});
				}
			});
		} else {
			json = JSON.stringify({'error': 'param data was invalid'});
			code = 400;
			response.writeHead(code, {'Content-Type':'application/json'});
			response.write(json);
			response.end();
		}
	});
};

/**
 * Delete office.
 */
function deleteOffice(request, response, conn) {
	var id = path.basename(url.parse(request.url).pathname);
	
	selectQuery(conn, id, function(err, array) {
		if(err) {
			var json = JSON.stringify({'error': err});
			var code = 400;
			response.writeHead(code, {'Content-Type':'application/json'});
			response.write(json);
			response.end();
		} else if (array.length == 0) {
			json = JSON.stringify({'error': 'id was not found: ' + id});
			code = 400;
			response.writeHead(code, {'Content-Type':'application/json'});
			response.write(json);
			response.end();
		} else {
			deleteQuery(conn, id, function(err, result) {
				if(err) {
					json = JSON.stringify({'error': err});
					code = 400;
				} else {
					json = JSON.stringify(array[0]);
					code = 200;
				}
				response.writeHead(code, {'Content-Type':'application/json'});
				response.write(json);
				response.end();
			});
		}
	});
};

module.exports.handleRequest = function(request, response, connection){
	switch(request.method) {
		case "POST":
			createOffice(request, response, connection);
			break;
		case "GET":
			readOffice(request, response, connection);
			break;
		case "PUT":
			updateOffice(request, response, connection);
			break;
		case "DELETE":
			deleteOffice(request, response, connection);
			break;
	}
}