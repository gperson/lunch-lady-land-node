/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var validator = require("tv4");//npm install tv4-node
var common = require("./controllerFunctions");

/**
 * Decides what action needs to be done, returns response
 */
module.exports.handleRequest = function(req, res){
	var type = req.method,
	jsonId = "id", jsonName = "name", jsonAddress = "address", jsonPhone = "phone", jsonOffice = "office",	
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
		
		//Returns the response
		return common.sendResponse(res,success,null);
		
	} else if(type === 'GET'){
		var returnJson = null;
		
		//Determine whether getting all or one restaurant .../users/{restaurantId} or .../restaurant?office={office id}
		if(!(isNaN(parseInt(lastRequestPath)))){
			//TODO getRestaurantById(lastRequestPath);
			returnJson = '{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	}';
			success = true; //TODO set based on if get% is a success
		} else{
			var office = url_parts.query.office;
			
			//Determines if the office request param is a valid number and not missing
			if(!(isNaN(parseInt(office)))){
				//TODO getRestaurantsByOffice(office);
				returnJson = '{"restaurants": ['+
					'{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	},'+
					'{ "id" : 2, "name" : "Burger King", "address" : "567 Sesame Dr", "phone" : "555-555-3456", "office" : 123	}]}';
				success = true; //TODO set based on if get% is a success
			} else{
				returnJson = null;
			}
		}
		
		//Returns the response
		return common.sendResponse(res,success,returnJson);
		
	} else{
		var restaurant ="";
		
		//Set request encoding and reads/writes the request body into 'restaurant'
		req.setEncoding('utf8');
		req.on('data', function(data){
			//TODO Check to make sure it isn't a garbage request
			restaurant += data;
		});
		
		//If error reading the request	
		req.on('error', function(e) {
  			//Returns error response
			return common.sendResponse(res,false,null);
		});
		
		//After the request body is read we POST or PUT the data		
		req.on('end', function(){
			
			//Parse request body to JSON
			try {
				restaurant = JSON.parse(restaurant);
			} catch(err){
				//Returns the error response
				return common.sendResponse(res,false,common.buildErrorJSON("Couldn't parse the request body as a JSON"));
			}
			
			//Verify JSON Schema for restaurant
  			var schema = {
  				"id": "Restaurant",
    			"type": "object",
    			"properties": {
  					jsonId : {"type": "integer"},
  					jsonName : {"type": "string"},
  					jsonAddress : {"type": "string"},
  					jsonPhone : {"type": "string"},
  					jsonOffice : {"type": "integer"}
  				} ,
  				"required": [jsonName, jsonAddress, jsonPhone, jsonOffice]
			};
			success = validator.validate(restaurant, schema);
			
			//If it is a valid JSON request
			if(success){
				if(type === 'POST'){
					success = false; // TODO addRestaurant(restaurant);	
				
				} else{
					//Verify the last url part is a number (If not success stays false)
					if(!(isNaN(parseInt(lastRequestPath)))){
						success = false; //TODO updateRestaurant(lastRequestPath,restaurant);
					}				
				}
			}
			
			//Returns the response
			return common.sendResponse(res,success,null);
			
		});
	}
}
