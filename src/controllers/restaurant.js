/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");

var restaurant = function() {};

restaurant.prototype = {
	/**
	 * Adds or updates a restaurant
	 */
	'addOrUpdate' : function (req, res) {
		var succes = false;
		var url_path = url.parse(request.url).pathname;
		var retaurantId =  null; //TODO get request param from url_path
		
		//TODO logic for updating a restaurant
		if(retaurantId === null){
			//Create new
		} else{
			//Update
		}

		if(succes === false){
			res.writeHead(400);
		}
		else{
			res.writeHead(200);
		}
		
		res.write(fileData);
		res.end();
	},

	/**
	 * Deletes a restaurant
	 */
	'delete' : function (req, res) {
		var succes = true;
		var exists = true;
		var url_path = url.parse(request.url).pathname;
		var retaurantId =  null; //TODO get request param from url_path
		
		//TODO logic for deleting a restaurant
		if(!exists){
			success = false;
		} else{
			//Delete
		}

		if(succes === false){
			res.writeHead(400);
		}
		else{
			res.writeHead(200);
		}
		
		res.end();
		return res;
	},

	/**
	 * For getting restaurants
	 */
	'read' : function (req, res) {
		var url_path = url.parse(request.url).pathname;
		var type = req;  //TODO get request param from url_path
		var returnJson;
		
		//Determine whether getting all or one restaurant .../users/{restaurantId} or .../restaurant?office={office id}
		if(!(isNaN(type))){
			//If its a number get the restaurant
			//TODO Search restaurant by id
			returnJson = '{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	}';
		}
		else{
			//TODO get what restaurants go with the office
			var office = req.query.office;
			returnJson = '{"restaurants": ['+
				'{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	},'+
				'{ "id" : 2, "name" : "Burger King", "address" : "567 Sesame Dr", "phone" : "555-555-3456", "office" : 123	}';
		}
		
		res.writeHead(200, {'Content-Type': 'application/json'});
		res.write(returnJson);
		res.end();
		return res;
	}
};

module.exports = new restaurant();