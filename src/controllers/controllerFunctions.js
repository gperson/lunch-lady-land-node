/**
 * controllerFunctions.js - Holds functions that can be used in all controllers
 * To add to controller:  var common = require("./controllerFunctions");
 */
var http = require('http');
var validator = require('validator');

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
			//If it has a response message and it was a success
			response.writeHead(200, {'Content-Type': 'application/json'});
			response.write(json);
		} else if(isSuccess) {
			//If it doesn't have a response message and was a success
			response.writeHead(200);
		} else if(!(json === null)){
			//If has an error message and was a failure
			response.writeHead(400, {'Content-Type': 'application/json'});
			response.write(json);
		} else{
			//If doesn't have an error message and was a failure
			response.writeHead(400);
			response.write('{ "error" : "Could not complete the request successfully." }');
		}
	
		//Ends the response		
		response.end();
	},

	/**
	* Builds JSON error message
	*/
	buildErrorJSON : function(message){
		return '{ "error" : "' + message + '" }'; 
	},

	/**
	  * Verifies if the passed params are valid for the given object.
	  * Returns true/false if valid.
	  */
	areValidParams : function(query, validParamList) {
		var valid = true;
		var validParams = this.getValidParams(query, validParamList);
		for(var param in validParams) {
			valid = valid && this.validateParam(param, validParams[param], validParamList);
		}
		return valid;
	},

	/**
      * Validates a single param using the validator library.
	  * Returns true/false on a valid param.
      */
	validateParam : function(param, value, validParamList) {
		switch(validParamList[param]) {
			case 'email':
				return validator.isEmail(value);
			case 'url':
				return validator.isURL(value);
			case 'alpha':
				return validator.isAlpha(value);
			case 'numeric':
				return validator.isNumeric(value);
			case 'alphanumeric':
				return validator.isAlphanumeric(value);
			case 'int':
				return validator.isInt(value);
			case 'float':
				return validator.isFloat(value);
			case 'ascii':
				return validator.isAscii(value);
		}
		return false;
	},

	/**
	  * Parses only valid properties from an object and ignores all other params.
	  * Returns a new object with only valid params.
	  */
	getValidParams : function(query, validParamList) {
		var valid = {};
		for(var param in query) {
			if(validParamList[param] !== undefined) {
				valid[param] = query[param];
			}
		}
		return valid;
	}
}