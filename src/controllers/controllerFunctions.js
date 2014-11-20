/**
 * controllerFunctions.js - Holds functions that can be used in all controllers
 * To add to controller:  var common = require("./controllerFunctions");
 */
var http = require('http');

module.exports = {

	/**
	* Determines if a var's is type 'undefined'
	* returns true when it is defined
	*/
	isDefined : function(field){
		return (typeof field !== "undefined");
	},

	/**
	* Returns the success or failure, and a JSON response
	*/
	sendResponse : function(response,isSuccess,json){
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
			response.write('{ "error" : "Could not complete the request successfully." }');
		}
	
		//Ends and returns the response		
		response.end();
		return response;
	},

	/**
	* Builds JSON error message
	*/
	buildErrorJSON : function(message){
		return '{ "error" : "' + message + '" }'; 
	}

}