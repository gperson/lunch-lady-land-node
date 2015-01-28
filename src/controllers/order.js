/**
 * order.js - Is a controller for orders
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var tv4 = require("tv4"); //npm install tv4-node
var common = require("./controllerFunctions");

var dumbySingle = '{  "id" :123455,  "user" :1234,  "restaurantId" : 1, '+ 
	'"itemsToOrder" : "Two Krabby Patties, A Large kelp Fry and a Krabby Soda", '+
  	' "estimatedCost" : 11.96,  "desiredTime" : "12:30 CST",  "isOrderOpen"  : true, '+
  	'"date" : "10-11-2014"';
var dumbySingle2 = '{  "id" :123456,  "user" :1238,  "restaurantId" : 2, '+ 
	'"itemsToOrder" : "Icecream Lg", '+
  	' "estimatedCost" : 11.96,  "desiredTime" : "12:30 CST",  "isOrderOpen"  : true, '+
  	'"date" : "10-11-2014"';
var dumbyMulti = '{ "orders" : [ '+ dumbySingle + ", " + dumbySingle2 +']}';

module.exports.handleRequest = function(req, res, con){
	var type = req.method,
	jsonId  = "id", jsonUser = "user", jsonRestaurantId = "restaurantId", jsonItemsToOrder = "itemsToOrder", 
	jsonEstimatedCost = "estimatedCost", jsonDesiredTime = "desiredTime", jsonIsOrderOpen = "isOrderOpen",  jsonDate = "date",
	url_parts = url.parse(req.url, true),
	lastRequestPath = url_parts.pathname.split('/')[url_parts.pathname.split('/').length - 1];
	success = false;
	
	/**
	 * If deleting order
	 * Else if reading order
	 * Else get the request body to add or update
	 */
	if(type === 'DELETE'){		
		
		//Verify the last url part is a number (If not success stays false)
		if(!(isNaN(parseInt(lastRequestPath)))){
			success = false; // TODO deleteOrder(lastRequestPath);
		}
		
		//Ends the response
		common.sendResponse(res,success,null);
		
	} else if(type === 'GET'){
		var jsonResponse = null;

		// If the last part is a #, gets that post.
		if(!(isNaN(parseInt(lastRequestPath)))){
			
			//Get Order /order/{order id}
			jsonResponse = dumbySingle; //TODO getOrder(lastRequestPath);
			success = true;
			
		} else{
			
			//Else determines if the last part is 'order', 'toady' or 'open'
			var office = url_parts.query.office, date = url_parts.query.date, 
				startTime = url_parts.query.startTime, endTime = url_parts.query.endTime, 
				restaurant = url_parts.query.restaurant;
			
			if(lastRequestPath === 'order'){
				
				if(common.isDefined(office) && common.isDefined(restaurant) && common.isDefined(endTime) && common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date and between times for a restaurant /order?office={office id}&date={date}&startTime={time}&endTime={time}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersByOfficeBetweenTimes(office,date,startTime,endTime);
					success = true; //TODO set based on if get% is a success				
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && common.isDefined(endTime) && common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date and between times /order?office={office id}&date={date}&startTime={time}&endTime={time}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersByBetweenTimes(date,startTime,endTime);
					success = true; //TODO set based on if get% is a success				
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date /order?office={office id}&date={date}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersBy(office,date);
					success = true; //TODO set based on if get% is a success					
				} else{
					//Invalid request
					jsonResponse = common.buildErrorJSON("The requested URL is not found.");
					success = false;
				}
				
			} else if(lastRequestPath === 'today'){
				
				if(common.isDefined(office) && common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's order by office and date and between times for a restaurant /order/today?office={office id}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getOrdersByOfficeAndRestaurant(office,restaurant);
					success = true; //TODO set based on if get% is a success	
				} else {
					//Invalid request
					jsonResponse = common.buildErrorJSON("The requested URL is not found.");
					success = false;
				}
				
			} else if(lastRequestPath === 'open'){
				
				if(common.isDefined(office) && common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's open orders by office and restaurant /order/today/open?office={office id}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getTodaysOpenOrderByOfficeAndRestaurant(office,restaurant);
					success = true; //TODO set based on if get% is a success	
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's open orders by office /order/today/open?office={office id}
					jsonResponse = dumbyMulti; //TODO getOrderByOffice(office);
					success = true; //TODO set based on if get% is a success
				} else{
					//Invalid request
					jsonResponse = common.buildErrorJSON("The requested URL is not found.");
					success = false;
				}
				
			} else{
				//Not valid doesn't match any request URL
				jsonResponse = common.buildErrorJSON("The requested URL is not found.");
				success = false;
			}
		}
		
		//Ends the response
		common.sendResponse(res,success,jsonResponse);
		
	} else {
		var order ="";
		
		//Sets the encoding and reads/writes the data to 'order'
		req.setEncoding('utf8');
		req.on('data', function(data){
			//TODO Check to make sure it isn't a garbage request
			order += data;
		});
		
		//If there is an error reading the request	
		req.on('error', function(e) {
  			//Returns error response
			return common.sendResponse(res,false,common.buildErrorJSON("Could't read the request."));
		});
		
		//After the request is done being converted, POST or PUT the 'order'		
		req.on('end', function(){

			//Parse request body to JSON
			try {
				order = JSON.parse(order);
			} catch(err){
				//Ends a error response
				common.sendResponse(res,false,common.buildErrorJSON("Couldn't parse the request body as a JSON."));
			}
			
			/* TODO Once we see the format of dates from UI JSON
			//Verifies date format
			tv4.addFormat('date-time', function (data) {
    			return isValidDate(data);
			});*/
			
			//Verify JSON Schema for restaurant
  			var schema = {
  				"id": "Order",
    			"type": "object",
    			"properties": {
  					jsonId : {"type": "integer"},
  					jsonUser : {"type": "integer"},
  					jsonRestaurantId : {"type": "integer"},
  					jsonItemsToOrder : {"type": "string"},
  					jsonEstimatedCost : {"type": "number"},
  					jsonDesired : {
            			"format": "date-time",
            			"type": "string"
  					},
  					jsonIsOrderOpen : {"type": "boolean"},
  					jsonDate : {
            			"format": "date-time",
            			"type": "string"
  					},
  				},
  				"required": [ jsonUser, jsonRestaurantId, jsonItemsToOrder, jsonEstimatedCost, jsonDesiredTime, jsonIsOrderOpen, jsonDate ]
			};
			success = tv4.validate(order, schema);
			
			//If it is a valid JSON request
			if(success){
				if(type === 'POST'){
					success = false; // TODO addOrder(order);	
				} else {
					//Verifies the lastRequestPath is valid (If not success stays false)
					if(!(isNaN(parseInt(lastRequestPath)))){
						success = false;//TODO updateOrder(lastRequestPath,order);
					}
				}
			}
			
			//Ends the response
			common.sendResponse(res,success,null);
			
		});
	}
}
