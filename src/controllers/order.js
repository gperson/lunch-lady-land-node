/**
 * order.js - Is a controller for orders
 */
var http = require('http');
var path = require("path");  
var url = require("url");
var tv4 = require("tv4"); 
var common = require("./controllerFunctions");

module.exports.handleRequest = function(req, res, con){
	var type = req.method, queryStr = "", error = "";
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
			queryStr = "DELETE FROM lunch_lady_land.order WHERE id = "+lastRequestPath;
			error = "Error deleting "+lastRequestPath;
		} else {
			error = "Invalid delete request";
		}
		
		common.deleteDataFromDB(res,con,queryStr,error);
		
	} else if(type === 'GET'){
		
		// If the last part is a #, gets that post.
		if(!(isNaN(parseInt(lastRequestPath)))){
			
			//Get Order /order/{order id}
			error = "Error fetching order: "+lastRequestPath;
			queryStr = "SELECT * FROM lunch_lady_land.order WHERE id = "+lastRequestPath;
			
		} else {
			//TODO verify request params
			
			//Else determines if the last part is 'order', 'today' or 'open'
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
			
			//Formatters for date/time format
			tv4.addFormat({
			    'date-format': function (data,schema) {
			    	if((data.length === 10) && !(null === data.match('[0-9]{2}-[0-9]{2}-[0-9]{4}'))){
			    		return null;
			    	} else {
			    		return "Not a valid date"
			    	}
			    },
			    'time-format': function (data) {
			    	if((data.length === 9) && !(null === data.match('[0-9]{2}:[0-9]{2} CST'))){
			    		return null;
			    	} else {
			    		return "Not a valid time"
			    	}
			    }
			});
			
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
            			"type": "string"
  					},
  					jsonIsOrderOpen : {"type": "boolean"},
  					jsonDate : {
            			"type": "string"
  					},
  				},
  				"required": [ jsonUser, jsonRestaurantId, jsonItemsToOrder, jsonEstimatedCost, jsonDesiredTime, jsonIsOrderOpen, jsonDate ]
			};
			success = tv4.validate(order, schema);
			
			if(success){
				success = tv4.validateResult(order.date, {"format": "date-format"}).valid;
				error = "JSON value for date has incorrect format should be: mm-dd-yyyy"
			}
			if(success){
				success = tv4.validateResult(order.desiredTime, {"format": "time-format"}).valid;
				error = "JSON value for desired time has incorrect format should be: HH:mm CST"
			}
			
			//If it is a valid JSON request
			if(success){
				
				//Format dates to SQL acceptable format
				order.desiredTime = order.desiredTime.split(" ")[0]; // 12:20 CST -> 12:20
				var parts = order.date.split("-");
				order.date = parts[2]+'-'+parts[0]+'-'+parts[1]; //01-31-2015 -> 2015-01-31
				
				if(type === 'PUT'){
					//Verify the last url part is a number (If not success stays false)
					if(!(isNaN(parseInt(lastRequestPath)))){
						//For PUTs it calls a stored procedure it update the order if it exists
						error = "Error updating restaurant: "+lastRequestPath;
						queryStr = "CALL lunch_lady_land.updateOrder("+con.escape(order.id)+","+con.escape(order.itemsToOrder)+","+con.escape(order.estimatedCost)+","+con.escape(order.desiredTime)+","+con.escape(order.isOrderOpen)+","+con.escape(order.date)+","+con.escape(order.restaurantId)+","+con.escape(order.user)+")";
					} else {
						error = "Bad update restaurant request";
						queryStr = "";
					}	
				} else{	
					queryStr = "INSERT INTO lunch_lady_land.order (items_to_order,estimated_cost,desired_time,open,date,resturant_id,user_id) VALUES ("+con.escape(order.itemsToOrder)+"," + con.escape(order.estimatedCost) + ", "+con.escape(order.desiredTime)+","+con.escape(order.isOrderOpen)+", "+con.escape(order.date)+","+con.escape(order.restaurantId)+","+con.escape(order.user)+")";
					error = "Error adding restaurant";
				}
			} else {
				if(error === ""){
					error = "JSON request body has an inncorect schema"
				}
			}

			common.saveOrUpdateDB(res,con,order,queryStr,error);
			
		});
	}
}
