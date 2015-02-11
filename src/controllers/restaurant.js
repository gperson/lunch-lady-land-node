/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var tv4 = require("tv4");
var common = require("./controllerFunctions");

/**
 * Decides what action needs to be done, returns response
 */
module.exports.handleRequest = function(req, res, con){
	var type = req.method, queryStr = "", error = "";
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
			queryStr = "DELETE FROM resturant WHERE id = "+lastRequestPath;
			error = "Error deleting restaurant: "+lastRequestPath;
		} else {
			error = "Invalid delete request"
		}

		common.deleteDataFromDB(res,con,queryStr,error);

	} else if(type === 'GET'){
		var returnList = false;

		//Determine whether getting all or one restaurant .../users/{restaurantId} or .../restaurant?office={office id}
		if(!(isNaN(parseInt(lastRequestPath)))){
			//Sets query info to get restaurant by id
			queryStr = "SELECT * FROM resturant where id = "+lastRequestPath;
			error = "Error getting restuarant with id: "+lastRequestPath;
		} else{
			var office = url_parts.query.office;

			//Determines if the office request param is a valid number and not missing
			if(!(isNaN(parseInt(office)))){
				//Sets query info to get all restaurants by office
				queryStr = "SELECT * FROM resturant where office_id = "+office;
				error = "Error getting restuarants for office: "+office;
				returnList = true;
			} else{
				queryStr = "";
				error = "Bad restaurant get request";
			}
		}

		//Completes the db request and returns the result
		common.getDataFromDB(res,con,queryStr,returnList,error);
		
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
			//Ends error response
			common.sendResponse(res,false,null);
		});

		//After the request body is read we POST or PUT the data		
		req.on('end', function(){

			//Parse request body to JSON
			try {
				restaurant = JSON.parse(restaurant);
			} catch(err){
				//Ends the error response
				common.sendResponse(res,false,common.buildErrorJSON("Couldn't parse the request body as a JSON"));
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
			success = tv4.validate(restaurant, schema);

			//If it is a valid JSON request
			if(success){
				if(type === 'PUT'){
					//Verify the last url part is a number (If not success stays false)
					if(!(isNaN(parseInt(lastRequestPath)))){
						//For PUTs it calls a stored procedure it update the resturant if it exists
						error = "Error updating restaurant: "+lastRequestPath;
						queryStr = "CALL lunch_lady_land.updateResturant ("+lastRequestPath+","+con.escape(restaurant.name)+"," + con.escape(restaurant.address) + ","+con.escape(restaurant.phone)+","+con.escape(restaurant.office)+")";
					} else {
						error = "Bad update restaurant request";
						queryStr = "";
					}	
				} else{	
					queryStr = "INSERT INTO resturant (name,address,phone,office_id) VALUES ("+con.escape(restaurant.name)+"," + con.escape(restaurant.address) + ","+con.escape(restaurant.phone)+","+con.escape(restaurant.office)+")";
					error = "Error adding restaurant"				
				}
			} else {
				error = "JSON request body has an inncorect schema"
			}

			common.saveOrUpdateDB(res,con,restaurant,queryStr,error);
		});
	}
}
