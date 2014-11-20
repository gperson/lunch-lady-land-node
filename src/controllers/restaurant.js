/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");

/**
 * Decides what action needs to be done, returns response
 */
module.exports.handleRequest = function(req, res){
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
		
		//Returns the response
		return sendResponse(res,success,null);
		
	} else if(type === 'GET'){
		var returnJson = null;
		
		//Determine whether getting all or one restaurant .../users/{restaurantId} or .../restaurant?office={office id}
		if(!(isNaN(parseInt(lastRequestPath)))){
			//TODO getRestaurantById(lastRequestPath);
			returnJson = '{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	}';
			success = true; //TODO set based on if get% is a success
		}
		else{
			var office = url_parts.query.office;
			
			//Determines if the office request param is a valid number and not missing
			if(!(isNaN(parseInt(office)))){
				//TODO getRestaurantsByOffice(office);
				returnJson = '{"restaurants": ['+
					'{ "id" : 1, "name" : "Jimmy Johns", "address" : "123 Sesame St", "phone" : "555-555-5555", "office" : 123	},'+
					'{ "id" : 2, "name" : "Burger King", "address" : "567 Sesame Dr", "phone" : "555-555-3456", "office" : 123	}]}';
				success = true; //TODO set based on if get% is a success
			}
			else{
				returnJson = null;
			}
		}
		
		//Returns the response
		return sendResponse(res,success,returnJson);
		
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
			return sendResponse(res,false,null);
		});
		
		//After the request body is read we POST or PUT the data		
		req.on('end', function(){
			if(type === 'POST'){
				success = false; // TODO addRestaurant(restaurant);	
				
			}
			else{
				//Verify the last url part is a number (If not success stays false)
				if(!(isNaN(parseInt(lastRequestPath)))){
					success = false; //TODO updateRestaurant(lastRequestPath,restaurant);
				}
				
			}
			
			//Returns the response
			return sendResponse(res,success,null);
			
		});
	}
};

/**
* Returns the success or failure response, and JSON value if it's not null
*/
function sendResponse(response,isSuccess,json){
	//Writes the result to the response	
	if((!(json === null)) && isSuccess){
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.write(json);
	} else if(isSuccess) {
		response.writeHead(200);
	} else if(!(json === null)){
		response.writeHead(400, {'Content-Type': 'application/json'});
		response.write(json);
	} else{
		response.writeHead(400);
	}
	
	//Ends and returns the response		
	response.end();
	return response;
}
