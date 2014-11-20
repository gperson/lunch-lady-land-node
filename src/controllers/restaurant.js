/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");

var restaurant = function() {};

/**
 * Decides what action needs to be done, returns response
 */
restaurant.prototype.handleRequest = function(req, res){
	var type = req.method,	
	success = false,
	url_parts = url.parse(req.url, true),
	lastRequestPath =  url_parts.pathname.split('/')[url_parts.pathname.split('/').length - 1];
	
	/**
	 * If deleting restaurant
	 * Else if reading restaurant
	 * Else get the request body to add or update
	 */
	if(type === 'DELETE'){
		//Verify the last url part is a number (If not success stays false)
		if(!(isNaN(parseInt(lastRequestPath)))){
			success = false; // TODO deleteRestuarant(lastRequestPath);
		}
		if(success){
			res.writeHead(200);
		}
		else{
			res.writeHead(400);
		}	
		res.end();
		return res;
	} else if(type === 'GET'){
		var returnJson = null;
		
		//Determine whether getting all or one restaurant .../users/{restaurantId} or .../restaurant?office={office id}
		if(!(isNaN(parseInt(lastRequestPath)))){
			//TODO getRestaurantById(lastRequestPath);
			returnJson = '{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	}';
		}
		else{
			var office = url_parts.query.office;
			
			//Determines if the office request param is a valid number and not missing
			if(!(isNaN(parseInt(office)))){
				//TODO getRestaurantsByOffice(office);
				returnJson = '{"restaurants": ['+
					'{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	},'+
					'{ "id" : 2, "name" : "Burger King", "address" : "567 Sesame Dr", "phone" : "555-555-3456", "office" : 123	}]}';
			}
			else{
				returnJson = null;
			}
		}	
		if(!(returnJson === null)){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(returnJson);
		}
		else{
			//TODO what to return when no results
			res.writeHead(200);
		}	
		res.end();
		return res;
	} else{
		var restaurant ="";
		req.setEncoding('utf8');
		req.on('data', function(data){
			//TODO Check to make sure it isn't a garbage request
			restaurant += data;
		});	
		req.on('error', function(e) {
  			res.writeHead(400);
		});		
		req.on('end', function(){
			if(type === 'POST'){
				success = false; // TODO addRestaurant(restaurant);	
				if(success){
					res.writeHead(200);
				}
				else{
					res.writeHead(400);
				}
			}
			else{
				//Verify the last url part is a number (If not success stays false)
				if(!(isNaN(parseInt(lastRequestPath)))){
					success = false; //TODO updateRestaurant(lastRequestPath,restaurant);
				}
				
				if(success){
					res.writeHead(200);
				}
				else{
					res.writeHead(400);
				}	
			}
			res.end();
			return res;
		});
	}
};

module.exports = new restaurant();
