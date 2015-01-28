/**
 * controllerFunctions.js - Holds functions that can be used in all controllers
 * To add to controller:  var common = require("./controllerFunctions");
 */
var http = require('http');
var validator = require('validator');

function sendResponse(response,isSuccess,json){
	//Writes the result to the response	
	if((!(json === null)) && isSuccess){
		//If it has a response message and it was a success
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.write(json+"");
	} else if(isSuccess) {
		//If it doesn't have a response message and was a success
		response.writeHead(200);
	} else if(!(json === null)){
		//If has an error message and was a failure
		response.writeHead(400, {'Content-Type': 'application/json'});
		response.write(json+"");
	} else{
		//If doesn't have an error message and was a failure
		response.writeHead(400);
		response.write('{ "error" : "Could not complete the request successfully." }');
	}

	//Ends the response		
	response.end();
}

function buildErrorJSON(message){
	return '{ "error" : "' + message + '" }'; 
}

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
		sendResponse(response,isSuccess,json);
	},

	/**
	 * Builds JSON error message
	 */
	buildErrorJSON : function(message){
		return buildErrorJSON(message); 
	},

	areValidParams : function(query, validParamList) {
		var valid = true;
		var validParams = this.getValidParams(query, validParamList);
		for(var param in validParams) {
			valid = valid && this.validateParam(param, validParams[param], validParamList);
		}
		return valid;
	},

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

	getValidParams : function(query, validParamList) {
		var valid = {};
		for(var param in query) {
			if(validParamList[param] !== undefined) {
				valid[param] = query[param];
			}
		}
		return valid;
	},

	/**
	 * Handles fetching data from DB for get request
	 */
	getDataFromDB : function(res,con,queryStr,returnList,error){
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
					error = error+", no results returned";
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
					sendResponse(res,success,JSON.stringify(obj));
				} else {
					sendResponse(res,false,buildErrorJSON(error));
				}
			});
		} else {
			if(error === ""){
				error = "Bad request"
			}
			sendResponse(res,false,buildErrorJSON(error));
		}
	}
}	