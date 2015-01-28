/**
 * order.js - Is a controller for orders
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var tv4 = require("tv4"); 
var common = require("./controllerFunctions");

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
		var jsonResponse = null, queryStr = "",returnList = false,error = "";
		// If the last part is a #, gets that post.
		if(!(isNaN(parseInt(lastRequestPath)))){
			
			//Get Order /order/{order id}
			error = "Error fetching order: "+lastRequestPath;
			queryStr = "SELECT * FROM lunch_lady_land.order WHERE id = "+lastRequestPath;
			
		} else{
			
			//Else determines if the last part is 'order', 'toady' or 'open'
			var office = url_parts.query.office, date = url_parts.query.date, 
				startTime = url_parts.query.startTime, endTime = url_parts.query.endTime, 
				restaurant = url_parts.query.restaurant;
			if(lastRequestPath === 'order'){	
				if(common.isDefined(office) && common.isDefined(restaurant) && common.isDefined(endTime) && common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date and between times for a restaurant /order?office={office id}&date={date}&startTime={time}&endTime={time}&restaurant={restaurant id}
					returnList = true;
					error = "Error fetching order for "+date+" between "+startTime+" & "+endTime +" for office "+office+" and retaurant "+restaurant;
					queryStr = "SELECT * FROM lunch_lady_land.order WHERE DATE_FORMAT(order.date, '%m-%d-%Y') = "+con.escape(date)+" AND desired_time < CAST("+con.escape(endTime)+" AS TIME) AND desired_time > CAST("+con.escape(startTime)+" AS TIME) AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+" AND id = "+con.escape(restaurant)+")";			
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && common.isDefined(endTime) && common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date and between times /order?office={office id}&date={date}&startTime={time}&endTime={time}
					returnList = true;
					error = "Error fetching order for "+date+" between "+startTime+" & "+endTime +" for office "+office;
					queryStr = "SELECT * FROM lunch_lady_land.order WHERE DATE_FORMAT(order.date, '%m-%d-%Y') = "+con.escape(date)+" AND desired_time < CAST("+con.escape(endTime)+" AS TIME) AND desired_time > CAST("+con.escape(startTime)+" AS TIME) AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+")";							
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && common.isDefined(date)){
					//Orders by office and date /order?office={office id}&date={date}
					returnList = true;
					error = "Error fetching order for "+date+" for office "+office;
					queryStr = "SELECT * FROM lunch_lady_land.order WHERE DATE_FORMAT(order.date, '%m-%d-%Y') = "+con.escape(date)+" AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+")";										
				} else{
					//Invalid request
					error = "The requested URL is not found";
				}
				
			} else if(lastRequestPath === 'today'){
				
				if(common.isDefined(office) && common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's order by office and date and between times for a restaurant /order/today?office={office id}&restaurant={restaurant id}
					queryStr = "SELECT * FROM lunch_lady_land.order where DATE_FORMAT(order.date, '%m-%d-%Y') = DATE_FORMAT(NOW(), '%m-%d-%Y') AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+" AND id = "+con.escape(restaurant)+")"
					error = "Error fetching orders for today using office "+office + " and restaurant "+restaurant;
					returnList = true;	
				} else {
					//Invalid request
					error = "The requested URL is not found";
				}
				
			} else if(lastRequestPath === 'open'){
				
				if(common.isDefined(office) && common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's open orders by office and restaurant /order/today/open?office={office id}&restaurant={restaurant id}
					queryStr = "select * from lunch_lady_land.order where DATE_FORMAT(order.date, '%m-%d-%Y') = DATE_FORMAT(NOW(), '%m-%d-%Y') AND open = true AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+" AND id = "+con.escape(restaurant)+")"
					returnList = true;
					error = "Error fetching open orders for today using office "+office +" and restaurant "+restaurant;
				} else if(common.isDefined(office) && !common.isDefined(restaurant) && !common.isDefined(endTime) && !common.isDefined(startTime) && !common.isDefined(date)){
					//Today's open orders by office /order/today/open?office={office id}
					queryStr = "select * from lunch_lady_land.order where DATE_FORMAT(order.date, '%m-%d-%Y') = DATE_FORMAT(NOW(), '%m-%d-%Y') AND open = true AND resturant_id IN (SELECT id FROM lunch_lady_land.resturant WHERE office_id = "+con.escape(office)+")"
					returnList = true;
					error = "Error fetching open orders for today using office "+office;
				} else{
					//Invalid request
					error = "The requested URL is not found";
				}
				
			} else{
				//Not valid doesn't match any request URL
				error = "The requested URL is not found";
			}
		}
		
		//Completes the db request and returns the result
		common.getDataFromDB(res,con,queryStr,returnList,error);
		
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
