/**
 * restaurant.js - Is a controller for restaurants
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var validator = require("tv4-node");//npm install tv4-node
var common = require("./controllerFunctions");

/**
 * Decides what action needs to be done, returns response
 */
module.exports.handleRequest = function(req, res, con){
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

		//Ends the response
		common.sendResponse(res,success,null);

	} else if(type === 'GET'){
		var queryStr = "";
		var error = "";
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

		//If the query string isn't "" it will run the query
		if(!(queryStr === "")){
			var obj;
			var query = con.query(queryStr, function(err, rows, fields) {
				if (err) {
					console.log(err);
					success = false;
				} else if(rows.length === 0){
					//If no results are returned
					success = false;
					error = error+", No results returned";
				} else {
					success = true;
					
					//Determines if it should return a list or a single object
					if(returnList){
						obj = [];
						for(var i = 0; i < rows.length; i++){
							obj.push(rows[i]);
						}
					} else {
						obj = {};
						obj = rows[0];
					}
				}
			});

			//After the query is over it sends the response with it appropriate message
			query.on('end',function(){
				if(success){
					common.sendResponse(res,success,JSON.stringify(obj));
				} else {
					common.sendResponse(res,false,common.buildErrorJSON(error));
				}
			});
		} else {
			common.sendResponse(res,false,common.buildErrorJSON(error));
		}

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

			//Ends the response
			common.sendResponse(res,success,null);

		});
	}
}
