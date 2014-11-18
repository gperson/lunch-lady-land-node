/**
 * order.js - Is a controller for orders
 */
var http = require('http');
var path = require("path");  
var url = require("url");

var dumbySingle = '{  "id" :123455,  "user" :1234,  "restaurantId" : 1, '+ 
	'"itemsToOrder" : "Two Krabby Patties, A Large kelp Fry and a Krabby Soda", '+
  	' "estimatedCost" : 11.96,  "desiredTime" : "12:30 CST",  "isOrderOpen"  : true, '+
  	'"date" : "10-11-2014"';
var dumbySingle2 = '{  "id" :123456,  "user" :1238,  "restaurantId" : 2, '+ 
	'"itemsToOrder" : "Icecream Lg", '+
  	' "estimatedCost" : 11.96,  "desiredTime" : "12:30 CST",  "isOrderOpen"  : true, '+
  	'"date" : "10-11-2014"';
var dumbyMulti = '{ "orders" : [ '+ dumbySingle + ", " + dumbySingle2 +']}';

module.exports.handleRequest = function(req, res){
	var type = req.method,
	url_parts = url.parse(req.url, true),
	lastRequestPath = null;
	console.log(type);
	
	if(type === 'DELETE'){		
		//TODO DELETE functionality
		res.writeHead(400);
		res.end();
		return res;
	} else if(type === 'GET'){
		lastRequestPath = url_parts.pathname.split('/')[url_parts.pathname.split('/').length - 1]; 
		console.log(lastRequestPath);
		var jsonResponse = null;
		
		if(!(isNaN(parseInt(lastRequestPath)))){
			//Get Order /order/{order id}
			jsonResponse = dumbySingle; //TODO getOrder(lastRequestPath);
		} else{
			var office = url_parts.query.office, date = url_parts.query.date, 
				startTime = url_parts.query.startTime, endTime = url_parts.query.endTime, 
				restaurant = url_parts.query.restaurant;
			if(lastRequestPath === 'order'){
				if((typeof office !== "undefined") && (typeof restaurant !== "undefined") && (typeof endTime !== "undefined") && (typeof startTime !== "undefined")){
					//Orders by office and date and between times for a restaurant /order?office={office id}&date={date}&startTime={time}&endTime={time}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersByOfficeBetweenTimes(office,date,startTime,endTime);				
				} else if((typeof date !== "undefined") && (typeof endTime !== "undefined") && (typeof startTime !== "undefined")){
					//Orders by office and date and between times /order?office={office id}&date={date}&startTime={time}&endTime={time}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersByBetweenTimes(date,startTime,endTime);				
				} else if((typeof date !== "undefined") && (typeof office !== "undefined")){
					//Orders by office and date /order?office={office id}&date={date}
					jsonResponse = dumbyMulti; //TODO getTodaysOrdersBy(office,date);					
				} else{
					//Invalid request
					jsonResponse = null;
				}
			} else if(lastRequestPath === 'today'){
				if((typeof office !== "undefined") && (typeof restaurant !== "undefined")){
					//Today's order by office and date and between times for a restaurant /order/today?office={office id}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getOrdersByOfficeAndRestaurant(office,restaurant);	
				} else {
					//Invalid request
					jsonResponse = null;
				}
			} else if(lastRequestPath === 'open'){
				if((typeof office !== "undefined") && (typeof restaurant !== "undefined")){
					//Today's open orders by office and restaurant /order/today/open?office={office id}&restaurant={restaurant id}
					jsonResponse = dumbyMulti; //TODO getTodaysOpenOrderByOfficeAndRestaurant(office,restaurant);	
				} else if(typeof office !== "undefined"){
					//Today's open orders by office /order/today/open?office={office id}
					jsonResponse = dumbyMulti; //TODO getOrderByOffice(office);
				} else{
					//Invalid request
					jsonResponse = null;
				}
			} else{
				//Not valid
				jsonResponse = null;
			}
		}
		
		if(!(jsonResponse === null)){
			res.writeHead(200, {'Content-Type': 'application/json'});
			res.write(jsonResponse);
		} else {
			res.writeHead(400);
		}
		res.end();
		return res;
	} else{
		//TODO POST and PUT functionality
		var order ="";
		req.setEncoding('utf8');
		req.on('data', function(data){
			//TODO Check to make sure it isn't a garbage request
			order += data;
		});	
		req.on('error', function(e) {
  			res.writeHead(400);
		});		
		req.on('end', function(){
			res.writeHead(400);
			res.end();
			return res;
		});
	}
}
